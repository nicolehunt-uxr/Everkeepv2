'use client'

import { useState, type FormEvent } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
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
import type { InteractionRecord } from './interaction-history'
import styles from './new-interaction-sheet.module.css'

export type InteractionFormValues = {
  interactionType: string | null
  date: string
  contactName: string
  contactInformation: string
  result: string | null
  notes: string
  transcribe: boolean
}

export const interactionTypes = [
  'Email',
  'Fax',
  'In Person',
  'Mail',
  'Phone Call',
  'Portal Message',
]

export const interactionResults = [
  'Request is being processed',
  'Record received',
  'Additional information needed',
  'Request denied',
  'Transferred to another department',
  'No response/unable to reach',
  'Other',
]

export function createEmptyForm(): InteractionFormValues {
  return {
    interactionType: null,
    date: '',
    contactName: '',
    contactInformation: '',
    result: null,
    notes: '',
    transcribe: false,
  }
}

export function parseInteractionDate(value: string) {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim())
  if (!match) return null

  const month = Number(match[1])
  const day = Number(match[2])
  const year = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return {
    display: new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date),
    dateTime: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  }
}

export function NewInteractionSheet({
  onSave,
}: {
  onSave: (interaction: InteractionRecord) => void
}) {
  const [open, setOpen] = useState(false)
  const [formValues, setFormValues] = useState(createEmptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  function updateForm<Key extends keyof InteractionFormValues>(
    key: Key,
    value: InteractionFormValues[Key],
  ) {
    setFormValues((current) => ({ ...current, [key]: value }))
    setFormError(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const interactionType = formValues.interactionType
    const result = formValues.result
    const date = formValues.date.trim()
    const contactName = formValues.contactName.trim()

    if (!interactionType || !result || !date || !contactName) {
      setFormError('Complete the interaction type, date, contact name, and result before saving.')
      return
    }

    const parsedDate = parseInteractionDate(date)
    if (!parsedDate) {
      setFormError('Enter a valid date in MM/DD/YYYY format.')
      return
    }

    onSave({
      id: `interaction-${crypto.randomUUID()}`,
      type: interactionType,
      contactName,
      contactInformation: formValues.contactInformation.trim() || 'Not provided',
      date: parsedDate.display,
      dateTime: parsedDate.dateTime,
      result,
      action: 'No follow-up action recorded.',
      notes: formValues.notes.trim() ? [formValues.notes.trim()] : [],
      transcript: [],
      transcriptionPermission: formValues.transcribe,
    })

    setFormValues(createEmptyForm())
    setFormError(null)
    setOpen(false)
  }

  return (
    <Dialog.Root
      disablePointerDismissal
      modal={false}
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setFormError(null)
      }}
    >
      <Dialog.Trigger
        render={
          <Button
            data-interaction-panel-open={open ? 'true' : undefined}
            size="sm"
            type="button"
            variant="default"
          >
            + New Interaction
          </Button>
        }
      />
      <Dialog.Portal>
        <Dialog.Viewport className={styles.dialogViewport}>
          <Dialog.Popup className={styles.dialogPopup}>
            <header className={styles.panelHeader}>
              <div className={styles.panelIntro}>
                <Dialog.Title className={styles.panelTitle}>
                  New Interaction
                </Dialog.Title>
                <Dialog.Description className={styles.panelDescription}>
                  Log a new interaction for this request.
                </Dialog.Description>
              </div>
              <Dialog.Close
                render={
                  <Button
                    aria-label="Close new interaction form"
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <X aria-hidden="true" />
                  </Button>
                }
              />
            </header>

            <form className={styles.sheetForm} onSubmit={handleSubmit}>
              <div className={styles.formBody}>
                <fieldset className={styles.formFieldset}>
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

                  <div className={styles.formField}>
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

                  <label className={styles.formField} htmlFor="interaction-notes">
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

                  <fieldset className={styles.transcribeField}>
                    <legend className={styles.fieldLabel}>Transcribe conversation?</legend>
                    <div className={styles.transcribeRow}>
                      <p className={styles.fieldHelp} id="transcribe-help">
                        Always ask permission before recording any conversations
                      </p>
                      <Switch
                        aria-describedby="transcribe-help"
                        aria-label="Transcribe this interaction"
                        checked={formValues.transcribe}
                        onCheckedChange={(checked) =>
                          updateForm('transcribe', checked)
                        }
                      />
                    </div>
                    {formValues.transcribe && (
                      <p aria-live="polite" className={styles.transcriptionStatus} role="status">
                        <span aria-hidden="true" className={styles.recordingIndicator} />
                        Transcription is on and recording.
                      </p>
                    )}
                  </fieldset>

                  {formError && (
                    <p className={styles.formError} role="alert">
                      {formError}
                    </p>
                  )}
                </fieldset>
              </div>

              <footer className={styles.formFooter}>
                <Button size="sm" type="submit" variant="default">
                  Save
                </Button>
              </footer>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
