import type { Metadata } from 'next'
import { NewAdministratorInteraction } from '../../../components/everkeep/new-administrator-interaction'

export const metadata: Metadata = {
  title: 'New Administrator Interaction | Administrator Interaction Log | Everkeep',
  description: 'Record an interaction with a medical records administrator.',
}

export default function NewAdministratorInteractionPage() {
  return <NewAdministratorInteraction />
}
