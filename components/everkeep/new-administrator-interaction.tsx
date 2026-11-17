'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  createEmptyForm,
  interactionResults,
  interactionTypes,
  parseInteractionDate,
  type InteractionFormValues,
} from './new-interaction-sheet'
import { RequestsShell } from './requests-shell'
import layoutStyles from './requests-dashboard.module.css'
import styles from './new-administrator-interaction.module.css'

const existingRequests = [
  'Holston Valley Medical Center',
  'Ballad Health',
]

export function NewAdministratorInteraction() {
  const [formValues, setFormValues] = useState(createEmptyForm)
  const [attachToOngoingRequest, setAttachToOngoingRequest] = useState(false)
  const [createNewRequest, setCreateNewRequest] = useState(false)
  const [newRequestOrganization, setNewRequestOrganization] = useState('')
  const [existingRequest, setExistingRequest] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function updateForm<Key extends keyof InteractionFormValues>(
    key: Key,
    value: InteractionFormValues[Key],
  ) {
    setFormValues((current) => ({ ...current, [key]: value }))
    setFormError(null)
    setSaved(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const interactionType = formValues.interactionType
    const result = formValues.result
    const date = formValues.date.trim()
    const contactName = formValues.contactName.trim()

    if (!interactionType || !result || !date || !contactName) {
      setFormError(
        'Complete the interaction type, date, contact name, and result before saving.',
      )
      return
    }

    if (!parseInteractionDate(date)) {
      setFormError('Enter a valid date in MM/DD/YYYY format.')
      return
    }

    if (attachToOngoingRequest && !existingRequest) {
      setFormError('Select an existing paper record request before saving.')
      return
    }

    setFormError(null)
    setSaved(true)
  }

  return (
    <RequestsShell>
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
            New administrator interaction
          </li>
        </ol>
      </nav>

      <header className={layoutStyles.pageHeader}>
        <h1 className={layoutStyles.pageTitle}>New Administrator Interaction</h1>
        <p className={layoutStyles.pageDescription}>
          Record a conversation or touchpoint with a medical records administrator.
        </p>
      </header>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        {saved && (
          <p className={styles.formSuccess} role="status">
            Interaction saved for this session.
          </p>
        )}

        <fieldset className={styles.formGrid}>
          <legend className="sr-only">Interaction details</legend>

          <div className={styles.formField}>
            <span className={styles.fieldLabel} id="interaction-type-label">
              Interaction type
            </span>
            <Select
              value={formValues.interactionType}
              onValueChange={(value) =>
                updateForm('interactionType', value as string | null)
              }
            >
              <SelectTrigger
                aria-invalid={Boolean(formError && !formValues.interactionType)}
                aria-labelledby="interaction-type-label"
                className={styles.selectTrigger}
                id="interaction-type"
              >
                <SelectValue placeholder="Select interaction type" />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                <SelectGroup>
                  {interactionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <label className={styles.formField} htmlFor="interaction-date">
            <span className={styles.fieldLabel}>Date</span>
            <Input
              aria-invalid={Boolean(
                formError &&
                  (!formValues.date.trim() ||
                    !parseInteractionDate(formValues.date.trim())),
              )}
              autoComplete="off"
              id="interaction-date"
              inputMode="numeric"
              maxLength={10}
              name="date"
              onChange={(event) => updateForm('date', event.currentTarget.value)}
              placeholder="MM/DD/YYYY"
              required
              type="text"
              value={formValues.date}
            />
          </label>

          <label className={styles.formField} htmlFor="contact-name">
            <span className={styles.fieldLabel}>Contact name</span>
            <Input
              aria-invalid={Boolean(formError && !formValues.contactName.trim())}
              autoComplete="name"
              id="contact-name"
              name="contactName"
              onChange={(event) =>
                updateForm('contactName', event.currentTarget.value)
              }
              required
              value={formValues.contactName}
            />
          </label>

          <label className={styles.formField} htmlFor="contact-information">
            <span className={styles.fieldLabel}>Contact information</span>
            <span className={styles.fieldHelp}>
              Phone number, email address, etc
            </span>
            <Input
              autoComplete="off"
              id="contact-information"
              name="contactInformation"
              onChange={(event) =>
                updateForm('contactInformation', event.currentTarget.value)
              }
              value={formValues.contactInformation}
            />
          </label>

          <div className={`${styles.formField} ${styles.fullWidth}`}>
            <span className={styles.fieldLabel} id="interaction-result-label">
              Result of interaction
            </span>
            <Select
              value={formValues.result}
              onValueChange={(value) =>
                updateForm('result', value as string | null)
              }
            >
              <SelectTrigger
                aria-invalid={Boolean(formError && !formValues.result)}
                aria-labelledby="interaction-result-label"
                className={styles.selectTrigger}
                id="interaction-result"
              >
                <SelectValue placeholder="Select a result" />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                <SelectGroup>
                  {interactionResults.map((result) => (
                    <SelectItem key={result} value={result}>
                      {result}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <fieldset className={`${styles.attachmentFieldset} ${styles.fullWidth}`}>
            <legend className={styles.fieldLabel}>Attach interaction to:</legend>
            <p className={styles.fieldHelp}>
              Choose whether to connect this interaction to a paper record request.
            </p>

            <label className={styles.checkboxRow} htmlFor="attach-ongoing-request">
              <input
                checked={attachToOngoingRequest}
                id="attach-ongoing-request"
                onChange={(event) => {
                  setAttachToOngoingRequest(event.currentTarget.checked)
                  if (!event.currentTarget.checked) setExistingRequest(null)
                  setFormError(null)
                  setSaved(false)
                }}
                type="checkbox"
              />
              <span>Attach to ongoing paper record request</span>
            </label>

            {attachToOngoingRequest && (
              <div className={styles.existingRequestField}>
                <span className={styles.fieldLabel} id="existing-request-label">
                  Select existing request
                </span>
                <Select
                  value={existingRequest}
                  onValueChange={(value) => {
                    setExistingRequest(value as string | null)
                    setFormError(null)
                    setSaved(false)
                  }}
                >
                  <SelectTrigger
                    aria-invalid={Boolean(formError && !existingRequest)}
                    aria-labelledby="existing-request-label"
                    className={styles.selectTrigger}
                    id="existing-request"
                  >
                    <SelectValue placeholder="Choose a request" />
                  </SelectTrigger>
                  <SelectContent align="start" alignItemWithTrigger={false}>
                    <SelectGroup>
                      {existingRequests.map((request) => (
                        <SelectItem key={request} value={request}>
                          {request}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            <label className={styles.checkboxRow} htmlFor="create-new-request">
              <input
                checked={createNewRequest}
                id="create-new-request"
                onChange={(event) => {
                  const checked = event.currentTarget.checked
                  setCreateNewRequest(checked)
                  if (!checked) setNewRequestOrganization('')
                  setFormError(null)
                  setSaved(false)
                }}
                type="checkbox"
              />
              <span>Create new paper record request log</span>
            </label>

            {createNewRequest && (
              <label
                className={`${styles.formField} ${styles.newRequestOrganizationField}`}
                htmlFor="new-request-organization"
              >
                <span className={styles.fieldLabel}>Health organization name</span>
                <Input
                  autoComplete="organization"
                  id="new-request-organization"
                  name="newRequestOrganization"
                  onChange={(event) => {
                    setNewRequestOrganization(event.currentTarget.value)
                    setFormError(null)
                    setSaved(false)
                  }}
                  value={newRequestOrganization}
                />
              </label>
            )}
          </fieldset>

          <label
            className={`${styles.formField} ${styles.fullWidth}`}
            htmlFor="interaction-notes"
          >
            <span className={styles.fieldLabel}>Notes</span>
            <span className={styles.fieldHelp}>
              Write down anything you want to remember from this interaction
            </span>
            <Textarea
              id="interaction-notes"
              name="notes"
              onChange={(event) => updateForm('notes', event.currentTarget.value)}
              rows={5}
              value={formValues.notes}
            />
          </label>

          <fieldset className={`${styles.transcribeField} ${styles.fullWidth}`}>
            <legend className={styles.fieldLabel}>Transcribe conversation?</legend>
            <div className={styles.transcribeRow}>
              <p className={styles.fieldHelp} id="transcribe-help">
                Always ask permission before recording any conversations
              </p>
              <Switch
                aria-describedby="transcribe-help"
                aria-label="Transcribe this interaction"
                checked={formValues.transcribe}
                onCheckedChange={(checked) => updateForm('transcribe', checked)}
              />
            </div>
            {formValues.transcribe && (
              <p aria-live="polite" className={styles.transcriptionStatus} role="status">
                <span aria-hidden="true" className={styles.recordingIndicator} />
                Transcription is on and recording.
              </p>
            )}
          </fieldset>
        </fieldset>

        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}

        <footer className={styles.formFooter}>
          <Link className={styles.cancelButton} href="/requests">
            Cancel
          </Link>
          <Button size="sm" type="submit" variant="default">
            Save
          </Button>
        </footer>
      </form>
    </RequestsShell>
  )
}
