import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import styles from './request-detail.module.css'

export type TranscriptLine = {
  speaker: string
  text: string
}

export type InteractionRecord = {
  id: string
  type: string
  contactName: string
  contactInformation: string
  date: string
  dateTime: string
  result: string
  action: string
  notes: string[]
  transcript: TranscriptLine[]
  transcriptionPermission?: boolean
}

export function InteractionHistory({
  interactions,
}: {
  interactions: InteractionRecord[]
}) {
  return (
    <Accordion className={styles.interactionList} multiple>
      {interactions.map((interaction) => (
        <AccordionItem
          className={styles.interactionCard}
          key={interaction.id}
          value={interaction.id}
        >
          <AccordionTrigger className={styles.interactionTrigger}>
            <span className={styles.interactionSummary}>
              <span className={styles.interactionSummaryField}>
                <span className={styles.interactionSummaryLabel}>
                  Interaction type
                </span>
                <span className={styles.interactionSummaryValue}>
                  {interaction.type}
                </span>
              </span>
              <span className={styles.interactionSummaryField}>
                <span className={styles.interactionSummaryLabel}>
                  Contact name
                </span>
                <span className={styles.interactionSummaryValue}>
                  {interaction.contactName}
                </span>
              </span>
              <span className={styles.interactionSummaryField}>
                <span className={styles.interactionSummaryLabel}>Date</span>
                <span className={styles.interactionSummaryValue}>
                  <time dateTime={interaction.dateTime}>{interaction.date}</time>
                </span>
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className={styles.interactionContent}>
            <dl className={styles.interactionDetails}>
              <div className={styles.interactionDetail}>
                <dt>Interaction type</dt>
                <dd>{interaction.type}</dd>
              </div>
              <div className={styles.interactionDetail}>
                <dt>Contact name</dt>
                <dd>{interaction.contactName}</dd>
              </div>
              <div className={styles.interactionDetail}>
                <dt>Contact information</dt>
                <dd>{interaction.contactInformation}</dd>
              </div>
              <div className={styles.interactionDetail}>
                <dt>Date</dt>
                <dd>
                  <time dateTime={interaction.dateTime}>{interaction.date}</time>
                </dd>
              </div>
              <div className={styles.interactionDetail}>
                <dt>Result of interaction</dt>
                <dd>{interaction.result}</dd>
              </div>
              <div className={styles.interactionDetail}>
                <dt>Action I need to take</dt>
                <dd>{interaction.action}</dd>
              </div>
              {interaction.transcriptionPermission !== undefined && (
                <div className={styles.interactionDetail}>
                  <dt>Transcription permission</dt>
                  <dd>
                    {interaction.transcriptionPermission
                      ? 'Granted'
                      : 'Not granted'}
                  </dd>
                </div>
              )}
            </dl>

            <section
              className={styles.interactionSubsection}
              aria-labelledby={`${interaction.id}-notes`}
            >
              <h3
                className={styles.interactionSubsectionTitle}
                id={`${interaction.id}-notes`}
              >
                Notes
              </h3>
              {interaction.notes.length > 0 ? (
                <ul className={styles.interactionNotes}>
                  {interaction.notes.map((note, index) => (
                    <li key={`${interaction.id}-note-${index}`}>{note}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noTranscript}>No notes recorded.</p>
              )}
            </section>

            <section
              className={styles.interactionSubsection}
              aria-labelledby={`${interaction.id}-transcript`}
            >
              <h3
                className={styles.interactionSubsectionTitle}
                id={`${interaction.id}-transcript`}
              >
                Transcript
              </h3>
              {interaction.transcript.length > 0 ? (
                <ol className={styles.transcriptList}>
                  {interaction.transcript.map((line, index) => (
                    <li key={`${interaction.id}-line-${index}`}>
                      <p className={styles.transcriptLine}>
                        <span className={styles.transcriptSpeaker}>
                          {line.speaker}
                        </span>
                        <span className={styles.transcriptText}>
                          {line.text}
                        </span>
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className={styles.noTranscript}>
                  {interaction.transcriptionPermission
                    ? 'Permission was noted; no transcript is attached.'
                    : 'No transcript attached to this interaction.'}
                </p>
              )}
            </section>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
