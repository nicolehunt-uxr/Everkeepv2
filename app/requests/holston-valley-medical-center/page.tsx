import type { Metadata } from 'next'
import { RequestDetail } from '../../../components/everkeep/request-detail'

export const metadata: Metadata = {
  title: 'Holston Valley Medical Center | Administrator Interaction Log | Everkeep',
  description:
    'Review request status and interaction history for Holston Valley Medical Center.',
}

export default function HolstonValleyRequestPage() {
  return <RequestDetail />
}
