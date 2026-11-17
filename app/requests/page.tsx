import type { Metadata } from 'next'
import { RequestsDashboard } from '../../components/everkeep/requests-dashboard'

export const metadata: Metadata = {
  title: 'Administrator Interaction Log | Everkeep',
  description:
    'Keep track of your requests for paper or non-electronic health records here.',
}

export default function RequestsPage() {
  return <RequestsDashboard />
}
