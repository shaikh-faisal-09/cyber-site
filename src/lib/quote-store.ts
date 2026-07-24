import { create } from 'zustand'

export type PlanId = 'basic' | 'value' | 'premium'

export type Answers = {
  industry?: string
  revenue?: number
  employees?: number
  cloudServices?: string
  operates?: string
  data?: string[]
  payments?: string
  securityAwareness?: string
  secureAccess?: string
  assetPatch?: string
  endpointControls?: string
  backupRecovery?: string
  emailSecurity?: string
  endpointProtection?: string
  incidentResponse?: string
}

export const QUESTION_COUNT = 15
export const STEP_LOADING = QUESTION_COUNT
export const STEP_PLANS = QUESTION_COUNT + 1
export const STEP_PAYMENT = QUESTION_COUNT + 2
export const STEP_DOCS = QUESTION_COUNT + 3
export const STEP_POLICY = QUESTION_COUNT + 4
export const TOTAL_STEPS = STEP_POLICY + 1

const SECURITY_WEIGHTS: Record<string, number> = {
  securityAwareness: 16,
  secureAccess: 22,
  assetPatch: 14,
  endpointControls: 12,
  backupRecovery: 18,
  emailSecurity: 10,
  endpointProtection: 14,
  incidentResponse: 12,
}

const GOOD_NO = new Set(['endpointControls'])
const SCORE_GAIN = 5
const SCORE_PENALTY = 2
const LOWER_RISK_POSTURE = 0.65

function valueScore(key: string, answer?: string): number {
  if (!answer) return 0
  if (answer === 'yes') return GOOD_NO.has(key) ? 0 : 1
  if (answer === 'no') return GOOD_NO.has(key) ? 1 : 0
  if (answer === 'unsure') return 0.5
  return 0
}

/** 0–1 posture score — higher = lower cyber risk for this answer */
function operatesPosture(operates?: string): number | null {
  if (!operates) return null
  const scores: Record<string, number> = {
    'Single location': 0.88,
    'Multiple offices': 0.68,
    Hybrid: 0.52,
    'Remote only': 0.48,
  }
  return scores[operates] ?? 0.6
}

function dataPosture(data?: string[]): number | null {
  if (!data?.length) return null
  if (data.includes('None')) return 0.92
  return Math.max(0.25, 0.9 - data.length * 0.07)
}

function paymentsPosture(payments?: string): number | null {
  if (!payments) return null
  if (payments === 'no') return 0.82
  if (payments === 'yes') return 0.52
  return 0.5
}

export function calcScore(a: Answers): number {
  // The score begins with the security-and-exposure questions. Business profile
  // answers above (industry, revenue and headcount) influence pricing only.
  const businessPostures = [
    a.cloudServices === undefined ? null : a.cloudServices === 'yes' ? 1 : 0,
    a.operates === undefined ? null : operatesPosture(a.operates),
    dataPosture(a.data),
    paymentsPosture(a.payments),
  ]
  let score = 0

  for (const posture of businessPostures) {
    if (posture == null) continue
    score += posture >= LOWER_RISK_POSTURE ? SCORE_GAIN : -SCORE_PENALTY
  }

  for (const key of Object.keys(SECURITY_WEIGHTS)) {
    const answer = a[key as keyof Answers] as string | undefined
    if (!answer) continue
    score += valueScore(key, answer) === 1 ? SCORE_GAIN : -SCORE_PENALTY
  }

  return Math.max(0, Math.min(100, score))
}

/** Subscribe to live cyber score derived from all answered questions */
export function useQuoteScore(): number {
  return useQuote((state) => calcScore(state.answers))
}

export function scoreGrade(score: number): { label: string; color: string } {
  if (score >= 50) return { label: 'Excellent', color: '#00C2FF' }
  if (score >= 35) return { label: 'Good', color: '#1976FF' }
  if (score >= 20) return { label: 'Fair', color: '#FFB020' }
  return { label: 'Poor', color: '#FF5470' }
}

/** Estimated SME percentile — higher score → better than more peers */
export function scoreBenchmarkPercentile(score: number): number {
  return Math.min(97, Math.max(8, Math.round(12 + score * 0.85)))
}

export function scoreExplanation(score: number, answers?: Answers): { summary: string; benchmark: string } {
  if (score === 0) {
    return {
      summary: 'Your score updates live as you answer each question.',
      benchmark: '',
    }
  }

  const grade = scoreGrade(score)
  const pct = scoreBenchmarkPercentile(score)
  const securityAnswered =
    answers &&
    (Object.keys(SECURITY_WEIGHTS) as (keyof Answers)[]).some((key) => answers[key])

  const meaning =
    score >= 85
      ? 'strong security controls across your answers — insurers see lower breach risk'
      : score >= 70
        ? 'solid cyber basics with a few areas to tighten up'
        : score >= 55
          ? 'noticeable gaps that may affect coverage terms or premium'
          : 'significant exposure — improving controls could unlock better pricing'

  const summary = securityAnswered
    ? `A score of ${score} (${grade.label}) means ${meaning}.`
    : `A score of ${score} (${grade.label}) reflects your business profile so far — security answers will move it the most.`

  return {
    summary,
    benchmark: `Better than ${pct}% of SMEs we assess.`,
  }
}

const INDUSTRY_MULT: Record<string, number> = {
  Technology: 1.1,
  Healthcare: 1.4,
  Retail: 1.2,
  Manufacturing: 1.1,
  Education: 1.05,
  'Professional Services': 1.0,
  Construction: 0.9,
  Hospitality: 1.1,
  Logistics: 1.05,
  'Financial Services': 1.5,
  'Government Contractor': 1.35,
  Other: 1.0,
}

function hasRemoteWork(operates?: string): boolean {
  return operates === 'Remote only' || operates === 'Hybrid'
}

export function estimatePremium(answers: Answers, score: number): number {
  const base = 3000
  let multiplier = 1

  if (answers.revenue != null) {
    multiplier *= Math.min(2.5, Math.max(0.7, Math.sqrt(answers.revenue / 1_000_000)))
  }
  if (answers.employees != null) {
    multiplier *= Math.min(1.75, Math.max(0.8, answers.employees / 25))
  }
  if (answers.industry) {
    multiplier *= INDUSTRY_MULT[answers.industry] ?? 1
  }
  if (answers.payments === 'yes') multiplier *= 1.08
  if (answers.cloudServices === 'yes') multiplier *= 1.04
  if (hasRemoteWork(answers.operates)) multiplier *= 1.05
  if (answers.data?.length) {
    multiplier *= 1 + Math.min(0.4, answers.data.length * 0.035)
  }

  const securityKeys = Object.keys(SECURITY_WEIGHTS) as (keyof Answers)[]
  const answeredSecurity = securityKeys.filter((key) => answers[key]).length
  if (answeredSecurity > 0) {
    const scoreDiscount = Math.max(0.7, 1 - score / 143)
    multiplier *= scoreDiscount
  }

  return Math.round((base * multiplier) / 10) * 10
}

export const PLAN_DEDUCTIBLE_OPTIONS: Record<PlanId, readonly number[]> = {
  basic: [2_500, 5_000, 10_000, 25_000],
  value: [1_000, 2_500, 5_000, 10_000],
  premium: [500, 1_000, 2_500, 5_000],
}

export const DEFAULT_PLAN_DEDUCTIBLES: Record<PlanId, number> = {
  basic: 5_000,
  value: 2_500,
  premium: 1_000,
}

type QuoteState = {
  step: number
  answers: Answers
  selectedPlanId: PlanId | null
  selectedDeductible: number | null
  planDeductibles: Record<PlanId, number>
  policyLimitIndex: number
  tradeLicenseName: string | null
  paymentComplete: boolean
  acceptedImprovements: string[]
  setAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void
  setSelectedPlan: (planId: PlanId) => void
  setPlanDeductible: (planId: PlanId, amount: number) => void
  setPolicyLimitIndex: (index: number) => void
  setTradeLicense: (name: string | null) => void
  setPaymentComplete: (complete: boolean) => void
  toggleAcceptedImprovement: (tipId: string) => void
  next: () => void
  prev: () => void
  goto: (step: number) => void
  reset: () => void
}

export const useQuote = create<QuoteState>((set) => ({
  step: 0,
  answers: {},
  selectedPlanId: null,
  selectedDeductible: null,
  planDeductibles: { ...DEFAULT_PLAN_DEDUCTIBLES },
  policyLimitIndex: 2,
  tradeLicenseName: null,
  paymentComplete: false,
  acceptedImprovements: [],
  setAnswer: (key, value) =>
    set((s) => ({ answers: { ...s.answers, [key]: value } })),
  setSelectedPlan: (planId) =>
    set((s) => ({
      selectedPlanId: planId,
      selectedDeductible: s.planDeductibles[planId],
    })),
  setPlanDeductible: (planId, amount) =>
    set((s) => ({
      planDeductibles: { ...s.planDeductibles, [planId]: amount },
      selectedDeductible:
        s.selectedPlanId === planId ? amount : s.selectedDeductible,
    })),
  setPolicyLimitIndex: (index) => set({ policyLimitIndex: index }),
  setTradeLicense: (name) => set({ tradeLicenseName: name }),
  setPaymentComplete: (complete) => set({ paymentComplete: complete }),
  toggleAcceptedImprovement: (tipId) =>
    set((s) => ({
      acceptedImprovements: s.acceptedImprovements.includes(tipId)
        ? s.acceptedImprovements.filter((id) => id !== tipId)
        : [...s.acceptedImprovements, tipId],
    })),
  next: () => set((s) => ({ step: Math.min(s.step + 1, TOTAL_STEPS - 1) })),
  prev: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),
  goto: (step) => set({ step: Math.max(0, Math.min(step, TOTAL_STEPS - 1)) }),
  reset: () =>
    set({
      step: 0,
      answers: {},
      selectedPlanId: null,
      selectedDeductible: null,
      planDeductibles: { ...DEFAULT_PLAN_DEDUCTIBLES },
      policyLimitIndex: 2,
      tradeLicenseName: null,
      paymentComplete: false,
      acceptedImprovements: [],
    }),
}))

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Education',
  'Professional Services',
  'Construction',
  'Hospitality',
  'Logistics',
  'Financial Services',
  'Government Contractor',
  'Other',
] as const

export const COUNTRIES = [
  'United Arab Emirates',
  'Saudi Arabia',
  'United Kingdom',
  'United States',
  'Germany',
  'France',
  'Singapore',
  'India',
  'Australia',
  'Other',
] as const

export const OPERATES = [
  'Single location',
  'Multiple offices',
  'Remote only',
  'Hybrid',
] as const

export const DATA_TYPES = [
  'Customer Names',
  'Email Addresses',
  'Phone Numbers',
  'Credit Card Data',
  'Payment Information',
  'Medical Records',
  'Employee Information',
  'Financial Records',
  'Bank Details',
  'Intellectual Property',
  'Trade Secrets',
  'Passwords',
  'Government IDs',
  'Tax Records',
  'Biometric Data',
  'None',
] as const

export const LIMITS = [250_000, 500_000, 1_000_000, 2_000_000, 5_000_000] as const

/** Higher deductible → factor below 1 (lower premium); lower deductible → factor above 1 */
export function deductiblePremiumFactor(selected: number, planDefault: number): number {
  const ratio = planDefault / selected
  return Math.max(0.78, Math.min(1.22, Math.pow(ratio, 0.18)))
}

export function planAnnualPremium(
  basePremium: number,
  planMultiplier: number,
  limitFactor: number,
  deductibleFactor = 1,
): number {
  return Math.round((basePremium * planMultiplier * limitFactor * deductibleFactor) / 10) * 10
}

export function getPlanPremium(
  basePremium: number,
  planId: PlanId,
  limitIndex: number,
  deductible?: number,
  improvementDiscount = 0,
): number {
  const plan = PLANS.find((p) => p.id === planId)
  if (!plan) return basePremium
  const limit = LIMITS[limitIndex] ?? LIMITS[2]
  const limitFactor = Math.pow(limit / 1_000_000, 0.6)
  const ded = deductible ?? plan.deductible
  const deductibleFactor = deductiblePremiumFactor(ded, plan.deductible)
  const discountFactor = 1 - Math.min(100, Math.max(0, improvementDiscount)) / 100
  return planAnnualPremium(basePremium * discountFactor, plan.multiplier, limitFactor, deductibleFactor)
}

export const PLANS = [
  {
    id: 'basic' as const,
    name: 'Basic',
    tag: null as string | null,
    multiplier: 1.0,
    deductible: 5_000,
    features: {
      'First Party Loss': true,
      'Cyber Liability': true,
      'Incident Response': true,
      'Data Recovery': true,
      'Business Interruption': false,
      Ransomware: true,
      'Cyber Crime': false,
      'Legal Costs': true,
      'PR Costs': false,
      'Regulatory Defence': false,
      'Privacy Liability': true,
      'Media Liability': false,
      'Network Liability': true,
      'Social Engineering': false,
      'Digital Assets': true,
    },
  },
  {
    id: 'value' as const,
    name: 'Value',
    tag: 'Most Popular',
    multiplier: 1.5,
    deductible: 2_500,
    features: {
      'First Party Loss': true,
      'Cyber Liability': true,
      'Incident Response': true,
      'Data Recovery': true,
      'Business Interruption': true,
      Ransomware: true,
      'Cyber Crime': true,
      'Legal Costs': true,
      'PR Costs': true,
      'Regulatory Defence': true,
      'Privacy Liability': true,
      'Media Liability': false,
      'Network Liability': true,
      'Social Engineering': true,
      'Digital Assets': true,
    },
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    tag: 'Recommended',
    multiplier: 1.75,
    deductible: 1_000,
    features: {
      'First Party Loss': true,
      'Cyber Liability': true,
      'Incident Response': true,
      'Data Recovery': true,
      'Business Interruption': true,
      Ransomware: true,
      'Cyber Crime': true,
      'Legal Costs': true,
      'PR Costs': true,
      'Regulatory Defence': true,
      'Privacy Liability': true,
      'Media Liability': true,
      'Network Liability': true,
      'Social Engineering': true,
      'Digital Assets': true,
    },
  },
] as const

export const FEATURE_LIST = [
  'First Party Loss',
  'Cyber Liability',
  'Incident Response',
  'Data Recovery',
  'Business Interruption',
  'Ransomware',
  'Cyber Crime',
  'Legal Costs',
  'PR Costs',
  'Regulatory Defence',
  'Privacy Liability',
  'Media Liability',
  'Network Liability',
  'Social Engineering',
  'Digital Assets',
] as const

export function generatePolicyNumber(): string {
  const year = new Date().getFullYear()
  const seq = Math.floor(100000 + Math.random() * 900000)
  return `SNT-${year}-${seq}`
}
