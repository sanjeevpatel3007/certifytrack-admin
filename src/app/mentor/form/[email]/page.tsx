'use client'

import { useParams } from 'next/navigation'
import MentorFormPage from './_components/MentorFormPage'

export default function Page() {
  const params = useParams()
  return <MentorFormPage email={params.email as string} />
} 