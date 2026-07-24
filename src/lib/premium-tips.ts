import type { LucideIcon } from 'lucide-react'
import {
  KeyRound,
  Cloud,
  GraduationCap,
  ShieldCheck,
  ClipboardCheck,
  Mail,
  AlertTriangle,
  LifeBuoy,
} from 'lucide-react'
import type { Answers } from './quote-store'

export type PremiumTip = {
  id: string
  answerKey: keyof Answers
  /** Answer value that triggers this tip (yes = bad for inverted endpointControls) */
  triggerAnswer: 'no' | 'yes'
  title: string
  time: string
  discount: number
  icon: LucideIcon
  bg: string
}

export const PREMIUM_TIPS: PremiumTip[] = [
  {
    id: 'security-awareness',
    answerKey: 'securityAwareness',
    triggerAnswer: 'no',
    title: 'Employee awareness training',
    time: '1 hr',
    discount: 5,
    icon: GraduationCap,
    bg: '#8b5cf6',
  },
  {
    id: 'secure-access',
    answerKey: 'secureAccess',
    triggerAnswer: 'no',
    title: 'Enable MFA & remote VPN',
    time: '20 min',
    discount: 8,
    icon: KeyRound,
    bg: '#6366f1',
  },
  {
    id: 'asset-patch',
    answerKey: 'assetPatch',
    triggerAnswer: 'no',
    title: 'Asset inventory & monthly patching',
    time: '45 min',
    discount: 5,
    icon: ClipboardCheck,
    bg: '#64748b',
  },
  {
    id: 'endpoint-controls',
    answerKey: 'endpointControls',
    triggerAnswer: 'yes',
    title: 'Lock software installs & replace legacy systems',
    time: '1 hr',
    discount: 6,
    icon: AlertTriangle,
    bg: '#f59e0b',
  },
  {
    id: 'backup-recovery',
    answerKey: 'backupRecovery',
    triggerAnswer: 'no',
    title: 'Automated cloud backups',
    time: '45 min',
    discount: 6,
    icon: Cloud,
    bg: '#0ea5e9',
  },
  {
    id: 'email-security',
    answerKey: 'emailSecurity',
    triggerAnswer: 'no',
    title: 'Email filtering & domain authentication',
    time: '30 min',
    discount: 4,
    icon: Mail,
    bg: '#ec4899',
  },
  {
    id: 'endpoint-protection',
    answerKey: 'endpointProtection',
    triggerAnswer: 'no',
    title: 'Endpoint detection & response',
    time: '1 hr',
    discount: 8,
    icon: ShieldCheck,
    bg: '#14b8a6',
  },
  {
    id: 'incident-response',
    answerKey: 'incidentResponse',
    triggerAnswer: 'no',
    title: 'Documented incident response plan',
    time: '2 hr',
    discount: 5,
    icon: LifeBuoy,
    bg: '#061a40',
  },
]

/** Keep improvement commitments meaningful without allowing discounts to erase the risk premium. */
export const MAX_COMBINED_PREMIUM_DISCOUNT = 25

export function getAcceptedPremiumDiscount(acceptedIds: readonly string[]): number {
  const accepted = new Set(acceptedIds)
  const total = PREMIUM_TIPS.reduce(
    (sum, tip) => sum + (accepted.has(tip.id) ? tip.discount : 0),
    0,
  )

  return Math.min(MAX_COMBINED_PREMIUM_DISCOUNT, total)
}

export function getApplicablePremiumTips(answers: Answers): PremiumTip[] {
  return PREMIUM_TIPS.filter((tip) => answers[tip.answerKey] === tip.triggerAnswer)
}

/** @deprecated use PREMIUM_TIPS */
export const PREMIUM_RECOMMENDATIONS = PREMIUM_TIPS.map(({ title, time, discount }) => ({
  title,
  time,
  discount,
  action: 'Accept',
}))
