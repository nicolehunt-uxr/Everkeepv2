'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const sectionLabels: Record<string, string> = {
  records: 'Records',
  share: 'Share my records',
  labs: 'Labs',
  imaging: 'Imaging',
  connections: 'Connections',
}

function getLabel(element: Element) {
  return (element.textContent ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\d+$/, '')
    .trim()
}

export function PrototypeHost() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const router = useRouter()

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    let attachedDocument: Document | null = null
    let clickHandler: ((event: MouseEvent) => void) | null = null
    let mutationObserver: MutationObserver | null = null

    const attachInteractions = () => {
      const document = iframe.contentDocument
      if (!document?.querySelector('nav[aria-label="Primary"]')) return
      if (document === attachedDocument) return

      if (attachedDocument && clickHandler) {
        attachedDocument.removeEventListener('click', clickHandler, true)
      }

      attachedDocument = document

      const prototypeLabel = Array.from(document.querySelectorAll('span')).find(
        (element) => element.textContent?.trim() === 'Prototype',
      )
      prototypeLabel?.parentElement?.style.setProperty('display', 'none')

      const setRequestsNavLabel = () => {
        const requestsNavButton = Array.from(
          document.querySelectorAll('nav[aria-label="Primary"] button'),
        ).find((button) =>
          ['Requests', 'Administrator Interaction Log'].includes(getLabel(button)),
        )
        const requestsLabel = requestsNavButton
          ? Array.from(requestsNavButton.querySelectorAll('span')).find((span) =>
              ['Requests', 'Administrator Interaction Log'].includes(
                span.textContent?.trim() ?? '',
              ),
            )
          : null
        if (
          requestsLabel &&
          requestsLabel.textContent?.trim() !== 'Administrator Interaction Log'
        ) {
          requestsLabel.textContent = 'Administrator Interaction Log'
        }
        if (requestsLabel) {
          requestsLabel.style.whiteSpace = 'normal'
          requestsLabel.style.fontSize = '13px'
          requestsLabel.style.lineHeight = '1.2'
        }

        const requestsBadge = requestsNavButton?.querySelector('.sc-interp')
        if (requestsBadge?.textContent?.trim() === '2') {
          requestsBadge.textContent = '1'
        }
      }

      const ensureHomeInteractionButton = () => {
        const shareRecordsButton = Array.from(
          document.querySelectorAll<HTMLButtonElement>('button'),
        ).find((button) => getLabel(button) === 'Share your records')
        if (!shareRecordsButton) return

        if (!document.querySelector('[data-everkeep-interaction-log-cta]')) {
          const adminInteractionButton = shareRecordsButton.cloneNode(
            true,
          ) as HTMLButtonElement
          adminInteractionButton.removeAttribute('id')
          adminInteractionButton.dataset.everkeepInteractionLogCta = 'true'
          adminInteractionButton.textContent = 'Add administrator interaction'
          adminInteractionButton.type = 'button'
          shareRecordsButton.insertAdjacentElement('afterend', adminInteractionButton)
        }

        const actionGroup = shareRecordsButton.parentElement
        if (!actionGroup) return

        actionGroup.style.setProperty('gap', '10px')
        for (const button of Array.from(
          actionGroup.querySelectorAll<HTMLButtonElement>('button'),
        )) {
          button.style.setProperty('font-size', '14px')
          button.style.setProperty('min-height', '44px')
          button.style.setProperty('padding-left', '10px')
          button.style.setProperty('padding-right', '10px')
        }
      }

      setRequestsNavLabel()
      ensureHomeInteractionButton()

      mutationObserver?.disconnect()
      const observerWindow = document.defaultView
      if (observerWindow) {
        mutationObserver = new observerWindow.MutationObserver(() => {
          setRequestsNavLabel()
          ensureHomeInteractionButton()
        })
        mutationObserver.observe(document.body, { childList: true, subtree: true })
      }

      clickHandler = (event) => {
        const frameWindow = document.defaultView
        if (!frameWindow || !(event.target instanceof frameWindow.Element)) return

        const flowButton = event.target.closest('button')
        if (flowButton && getLabel(flowButton) === 'Flow 3: Browser extension') {
          if (window.location.pathname !== '/browser-extension') {
            frameWindow.setTimeout(
              () => window.history.pushState(null, '', '/browser-extension'),
              0,
            )
          }
        }

        const interactionLogCta = event.target.closest(
          'button[data-everkeep-interaction-log-cta]',
        )
        if (interactionLogCta) {
          event.preventDefault()
          event.stopImmediatePropagation()
          router.push('/requests/new-administrator-interaction')
          return
        }

        const primaryButton = event.target.closest(
          'nav[aria-label="Primary"] button',
        )
        if (!primaryButton) return

        if (
          getLabel(primaryButton) === 'Requests' ||
          getLabel(primaryButton) === 'Administrator Interaction Log'
        ) {
          event.preventDefault()
          event.stopImmediatePropagation()
          router.push('/requests')
          return
        }

        if (window.location.pathname === '/browser-extension') {
          frameWindow.setTimeout(
            () => window.history.replaceState(null, '', '/'),
            0,
          )
        }
      }

      document.addEventListener('click', clickHandler, true)

      const searchParams = new URLSearchParams(window.location.search)
      const flow =
        window.location.pathname === '/browser-extension'
          ? '3'
          : searchParams.get('flow')
      const section = searchParams.get('section')
      const frameWindow = document.defaultView
      let targetButton: HTMLButtonElement | undefined

      if (flow) {
        targetButton = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(
          (button) => getLabel(button).startsWith(`Flow ${flow}:`),
        )
      } else if (section && sectionLabels[section]) {
        targetButton = Array.from(
          document.querySelectorAll<HTMLButtonElement>(
            'nav[aria-label="Primary"] button',
          ),
        ).find((button) => getLabel(button) === sectionLabels[section])
      }

      if (targetButton && frameWindow) {
        frameWindow.setTimeout(() => targetButton?.click(), 0)
      }
    }

    iframe.addEventListener('load', attachInteractions)
    attachInteractions()

    return () => {
      iframe.removeEventListener('load', attachInteractions)
      if (attachedDocument && clickHandler) {
        attachedDocument.removeEventListener('click', clickHandler, true)
      }
      mutationObserver?.disconnect()
    }
  }, [router])

  return (
    <main
      style={{
        width: '100%',
        height: '100dvh',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#F6F3FB',
      }}
    >
      <iframe
        ref={iframeRef}
        title="Everkeep interactive prototype"
        src="/everkeep-prototype.html"
        loading="eager"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          border: 0,
          backgroundColor: '#F6F3FB',
        }}
      />
    </main>
  )
}
