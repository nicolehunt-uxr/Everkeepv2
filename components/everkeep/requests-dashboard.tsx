import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { RequestsShell } from './requests-shell'
import styles from './requests-dashboard.module.css'

const metrics = [
  { value: 2, label: 'Active requests', tone: 'active' },
  { value: 1, label: 'Follow-up needed', tone: 'follow-up' },
  { value: 1, label: 'Waiting on administrator', tone: 'waiting' },
  { value: 3, label: 'Completed', tone: 'complete' },
] as const

type RequestItem = {
  clinic: string
  specialty: string
  recordsDate: string
  lastContact: string
  lastContactIso: string
  status: string
  statusTone: 'follow-up' | 'waiting' | 'completed'
  interactionHref?: string
}

const activeRequests: RequestItem[] = [
  {
    clinic: 'Ballad Health',
    specialty: 'Neurology',
    recordsDate: '2024–2025',
    lastContact: 'October 28, 2026',
    lastContactIso: '2026-10-28',
    status: 'Follow-up needed',
    statusTone: 'follow-up',
  },
  {
    clinic: 'Holston Valley Medical Center',
    specialty: 'Cardiology',
    recordsDate: '2022–2025',
    lastContact: 'October 22, 2026',
    lastContactIso: '2026-10-22',
    status: 'Waiting on administrator',
    statusTone: 'waiting',
    interactionHref: '/requests/holston-valley-medical-center',
  },
]

const completedRequests: RequestItem[] = [
  {
    clinic: 'Valley Radiology',
    specialty: 'Radiology',
    recordsDate: '2021–2024',
    lastContact: 'October 16, 2026',
    lastContactIso: '2026-10-16',
    status: 'Completed',
    statusTone: 'completed',
  },
  {
    clinic: 'Cedar Grove Imaging',
    specialty: 'Orthopedics',
    recordsDate: '2020–2022',
    lastContact: 'September 28, 2026',
    lastContactIso: '2026-09-28',
    status: 'Completed',
    statusTone: 'completed',
  },
  {
    clinic: 'Pinecrest Family Clinic',
    specialty: 'Family Medicine',
    recordsDate: '2021–2024',
    lastContact: 'September 16, 2026',
    lastContactIso: '2026-09-16',
    status: 'Completed',
    statusTone: 'completed',
  },
]

function RequestCard({
  request,
  showInteractionButton = false,
}: {
  request: RequestItem
  showInteractionButton?: boolean
}) {
  return (
    <li className={styles.requestListItem}>
      <article className={styles.requestCard}>
        <div className={styles.requestHeader}>
          <div className={styles.requestIdentity}>
            <h3 className={styles.clinicName}>{request.clinic}</h3>
            <p className={styles.specialty}>{request.specialty}</p>
          </div>
          <Badge
            className={styles.statusBadge}
            data-status={request.statusTone}
            variant="outline"
          >
            {request.status}
          </Badge>
        </div>

        <dl className={styles.requestDetails}>
          <div className={styles.requestDetail}>
            <dt>Records date</dt>
            <dd>{request.recordsDate}</dd>
          </div>
          <div className={styles.requestDetail}>
            <dt>Last contact</dt>
            <dd>
              <time dateTime={request.lastContactIso}>
                {request.lastContact}
              </time>
            </dd>
          </div>
        </dl>

        {showInteractionButton && (
          <div className={styles.requestActions}>
            {request.interactionHref ? (
              <Link
                className={buttonVariants({ size: 'sm', variant: 'default' })}
                href={request.interactionHref}
              >
                Open Request
              </Link>
            ) : (
              <Button size="sm" type="button" variant="default">
                Open Request
              </Button>
            )}
          </div>
        )}
      </article>
    </li>
  )
}

export function RequestsDashboard() {
  return (
    <RequestsShell>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Administrator Interaction Log</h1>
        <p className={styles.pageDescription}>
          Keep track of your requests for paper or non-electronic health records here.
        </p>
      </header>

      <section className={styles.metrics} aria-label="Request summary">
        {metrics.map((metric) => (
          <article
            aria-label={`${metric.value} ${metric.label}`}
            className={styles.metricCard}
            data-tone={metric.tone}
            key={metric.label}
          >
            <p className={styles.metricValue}>{metric.value}</p>
            <p className={styles.metricLabel}>{metric.label}</p>
          </article>
        ))}
      </section>

      <div className={styles.newRequestActions}>
        <Link
          className={`${styles.newRequest} ${styles.newInteraction}`}
          href="/requests/new-administrator-interaction"
        >
          <Plus aria-hidden="true" size={18} strokeWidth={2.2} />
          <span>New Administrator Interaction</span>
        </Link>
        <button
          className={`${styles.newRequest} ${styles.newPaperRequest}`}
          type="button"
        >
          <Plus aria-hidden="true" size={18} strokeWidth={2.2} />
          <span>New Paper Record Request</span>
        </button>
      </div>

      <section
        className={styles.activeSection}
        aria-labelledby="active-requests-title"
      >
        <h2 className={styles.sectionTitle} id="active-requests-title">
          Active requests
        </h2>
        <ul className={styles.requestGrid}>
          {activeRequests.map((request) => (
            <RequestCard
              key={request.clinic}
              request={request}
              showInteractionButton
            />
          ))}
        </ul>
      </section>

      <section
        className={styles.completedSection}
        aria-labelledby="completed-requests-title"
      >
        <h2 className={styles.sectionTitle} id="completed-requests-title">
          Completed requests
        </h2>
        <ul className={styles.requestGrid}>
          {completedRequests.map((request) => (
            <RequestCard key={request.clinic} request={request} />
          ))}
        </ul>
      </section>
    </RequestsShell>
  )
}
