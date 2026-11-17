import { RequestsShell } from './requests-shell'
import { RequestDetailClient } from './request-detail-client'

export function RequestDetail() {
  return (
    <RequestsShell>
      <RequestDetailClient />
    </RequestsShell>
  )
}
