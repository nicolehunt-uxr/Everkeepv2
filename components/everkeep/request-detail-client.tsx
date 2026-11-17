'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { InteractionHistory, type InteractionRecord } from './interaction-history'
import { NewInteractionSheet } from './new-interaction-sheet'
import layoutStyles from './requests-dashboard.module.css'
import styles from './request-detail.module.css'

const initialInteractions: InteractionRecord[] = [
  {
    id: 'phone-call-2026-10-22',
    type: 'Phone call',
    contactName: 'Samantha Jones',
    contactInformation: '461-550-0007 extension 548',
    date: 'October 22, 2026',
    dateTime: '2026-10-22',
    result: 'Request is being processed',
    action: "I can call in a week if I haven't heard from her.",
    notes: [
      "Samantha said she needs to look through paper archive - that's probably where it is",
      "She said she'd call within a week if she can't find it. Otherwise she'll send me a scanned version through the portal.",
      "I can call in a week if I haven't heard from her",
    ],
    transcript: [
      {
        speaker: 'Caller 1',
        text: "Hi, I'm calling to request a copy of my tilt table test records from 2022. I understand these records may not be digitized, but I'd like to get a copy if they're still available.",
      },
      {
        speaker: 'Caller 2',
        text: "Sure, let me look into that for you. Since those records are from 2022, I'll need to check our paper archives. That's probably where they'll be.",
      },
      {
        speaker: 'Caller 1',
        text: 'Okay, that sounds good. Are you able to send me a copy once you locate them?',
      },
      {
        speaker: 'Caller 2',
        text: "Yes. I'll look through the paper archive. If I can't find the records, I'll give you a call within a week to let you know. If I do find them, I'll have them scanned and sent to you through the patient portal.",
      },
      {
        speaker: 'Caller 1',
        text: 'Perfect. Should I expect to hear from you either way?',
      },
      {
        speaker: 'Caller 2',
        text: "You'll only hear from me if I'm unable to locate them. Otherwise, you should see the scanned records come through the portal.",
      },
      {
        speaker: 'Caller 1',
        text: "Got it. And if I haven't received anything after a week, can I call back to check on the status?",
      },
      {
        speaker: 'Caller 2',
        text: "Absolutely. Just give us a call if you haven't heard anything by then.",
      },
      {
        speaker: 'Caller 1',
        text: 'Great, thank you for your help!',
      },
      {
        speaker: 'Caller 2',
        text: "You're welcome. Have a good day.",
      },
    ],
  },
  {
    id: 'portal-message-2026-10-20',
    type: 'Portal message',
    contactName: 'Medical Records team',
    contactInformation: 'Patient portal',
    date: 'October 20, 2026',
    dateTime: '2026-10-20',
    result: 'Request received',
    action: 'Await an update from the records administrator.',
    notes: ['Example history entry; additional interaction details were not provided.'],
    transcript: [],
  },
  {
    id: 'initial-request-2026-10-18',
    type: 'Initial request',
    contactName: 'Medical Records team',
    contactInformation: 'Patient portal',
    date: 'October 18, 2026',
    dateTime: '2026-10-18',
    result: 'Request submitted for processing',
    action: 'Wait for the records team to review the request.',
    notes: ['Example history entry; additional interaction details were not provided.'],
    transcript: [],
  },
]

export function RequestDetailClient() {
  const [interactions, setInteractions] = useState(initialInteractions)
  const orderedInteractions = [...interactions].sort((first, second) =>
    second.dateTime.localeCompare(first.dateTime),
  )
  const firstRequest = interactions.reduce((earliest, interaction) =>
    interaction.dateTime < earliest.dateTime ? interaction : earliest,
  )
  const lastContact = orderedInteractions[0]

  function handleSave(interaction: InteractionRecord) {
    setInteractions((current) => [...current, interaction])
  }

  return (
    <>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <Link className={styles.breadcrumbLink} href="/requests">
              Administrator Interaction Log
            </Link>
          </li>
          <li aria-hidden="true" className={styles.breadcrumbSeparator}>
            /
          </li>
          <li aria-current="page" className={styles.breadcrumbCurrent}>
            Holston Valley Medical Center
          </li>
        </ol>
      </nav>

      <header className={layoutStyles.pageHeader}>
        <h1 className={layoutStyles.pageTitle}>Holston Valley Medical Center</h1>
      </header>

      <section
        className={styles.summaryCard}
        aria-labelledby="request-summary-title"
      >
        <h2 className={styles.summaryTitle} id="request-summary-title">
          Request summary
        </h2>
        <dl className={styles.summaryGrid}>
          <div className={styles.summaryField}>
            <dt>Record</dt>
            <dd>Tilt table test</dd>
          </div>
          <div className={styles.summaryField}>
            <dt>Ordering doctor&apos;s name</dt>
            <dd>Dr. Suraj Smith</dd>
          </div>
          <div className={styles.summaryField}>
            <dt>Interactions</dt>
            <dd>{interactions.length}</dd>
          </div>
          <div className={styles.summaryField}>
            <dt>First request made</dt>
            <dd>
              <time dateTime={firstRequest.dateTime}>{firstRequest.date}</time>
            </dd>
          </div>
          <div className={styles.summaryField}>
            <dt>Last contact</dt>
            <dd>
              <time dateTime={lastContact.dateTime}>{lastContact.date}</time>
            </dd>
          </div>
          <div className={styles.summaryField}>
            <dt>Records date</dt>
            <dd>2022</dd>
          </div>
          <div className={styles.summaryField}>
            <dt>Status</dt>
            <dd>
              <Badge
                className={styles.summaryStatus}
                data-status="waiting"
                variant="outline"
              >
                Waiting on administrator
              </Badge>
            </dd>
          </div>
        </dl>
      </section>

      <section
        className={styles.interactionSection}
        aria-labelledby="interaction-history-title"
      >
        <div className={styles.interactionHeadingRow}>
          <h2 className={styles.interactionHeading} id="interaction-history-title">
            Interaction history
          </h2>
          <NewInteractionSheet onSave={handleSave} />
        </div>
        <InteractionHistory interactions={orderedInteractions} />
      </section>
    </>
  )
}
