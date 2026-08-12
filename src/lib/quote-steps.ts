import type { Answers } from './quote-store'

const YES_NO_LABELS: Record<string, string> = {
  yes: 'Yes',
  no: 'No',
  unsure: 'Not sure',
}

const REVENUE_LABELS: Record<number, string> = {
  500_000: 'CA$500K',
  1_000_000: 'CA$1M',
  2_500_000: 'CA$2.5M',
  5_000_000: 'CA$5M',
  10_000_000: 'CA$10M',
  25_000_000: 'CA$25M',
  50_000_000: 'CA$50M+',
}

const EMPLOYEE_LABELS: Record<number, string> = {
  10: '1–10',
  25: '11–25',
  50: '26–50',
  100: '51–100',
  250: '101–250',
  500: '250+',
}

const YES_NO_STEPS = [
  'payments',
  'securityAwareness',
  'secureAccess',
  'assetPatch',
  'endpointControls',
  'backupRecovery',
  'emailSecurity',
  'endpointProtection',
  'incidentResponse',
] as const

export function isStepAnswered(id: string, answers: Answers): boolean {
  switch (id) {
    case 'industry':
      return !!answers.industry
    case 'revenue':
      return answers.revenue != null
    case 'employees':
      return answers.employees != null
    case 'cloudServices':
      return !!answers.cloudServices
    case 'operates':
      return !!answers.operates
    case 'data':
      return (answers.data?.length ?? 0) > 0
    default:
      if (YES_NO_STEPS.includes(id as (typeof YES_NO_STEPS)[number])) {
        return !!answers[id as keyof Answers]
      }
      return false
  }
}

export function getAnswerSummary(id: string, answers: Answers): string | null {
  switch (id) {
    case 'industry':
      return answers.industry ?? null
    case 'revenue':
      return answers.revenue != null
        ? REVENUE_LABELS[answers.revenue] ?? `CA$${answers.revenue.toLocaleString()}`
        : null
    case 'employees':
      return answers.employees != null
        ? EMPLOYEE_LABELS[answers.employees] ?? `${answers.employees} people`
        : null
    case 'cloudServices': {
      const val = answers.cloudServices
      return val ? YES_NO_LABELS[val] ?? val : null
    }
    case 'operates':
      return answers.operates ?? null
    case 'data':
      return answers.data?.length ? answers.data.join(', ') : null
    default:
      if (YES_NO_STEPS.includes(id as (typeof YES_NO_STEPS)[number])) {
        const val = answers[id as keyof Answers] as string | undefined
        return val ? YES_NO_LABELS[val] ?? val : null
      }
      return null
  }
}
