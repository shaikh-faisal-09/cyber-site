import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { CheckCircle2, Download, ShieldCheck } from 'lucide-react'
import { QuoteCheckoutShell } from './QuoteCheckoutShell'
import { ScoreGauge } from './ScoreGauge'
import { fmtNumber } from '@/lib/utils'
import {
  type Answers,
  type PlanId,
  LIMITS,
  PLANS,
  generatePolicyNumber,
  scoreGrade,
} from '@/lib/quote-store'
import { getAnswerSummary } from '@/lib/quote-steps'

type QuotePolicyPanelProps = {
  answers: Answers
  score: number
  planId: PlanId
  limitIndex: number
  deductible: number
  annualPremium: number
  tradeLicenseName: string | null
  onBack: () => void
}

const SUMMARY_FIELDS = [
  { id: 'industry', label: 'Industry' },
  { id: 'revenue', label: 'Annual revenue' },
  { id: 'employees', label: 'Employees' },
  { id: 'cloudServices', label: 'Cloud services' },
  { id: 'operates', label: 'Work setup' },
  { id: 'data', label: 'Sensitive data' },
  { id: 'payments', label: 'Online payments' },
] as const

export function QuotePolicyPanel({
  answers,
  score,
  planId,
  limitIndex,
  deductible,
  annualPremium,
  tradeLicenseName,
  onBack,
}: QuotePolicyPanelProps) {
  const policyNumber = useMemo(() => generatePolicyNumber(), [])
  const plan = PLANS.find((p) => p.id === planId)
  const limit = LIMITS[limitIndex] ?? LIMITS[2]
  const grade = scoreGrade(score)
  const effectiveDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const fmtLimit = (n: number) => (n >= 1_000_000 ? `CA$${n / 1_000_000}M` : `CA$${n / 1_000}K`)

  return (
    <QuoteCheckoutShell
      title="Your policy is ready"
      subtitle="Review your coverage details below. This is a demo policy document."
      stepLabel="Policy issued"
      onBack={onBack}
    >
      <div className="rounded-[20px] bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3 border-b border-[#f2f2f7] pb-5">
          <span className="flex size-12 items-center justify-center rounded-full bg-[#22c55e]/10">
            <CheckCircle2 className="size-7 text-[#16a34a]" />
          </span>
          <div>
            <p className="text-[13px] font-medium text-[#16a34a]">Policy issued successfully</p>
            <p className="mt-0.5 font-display text-xl text-navy-deep">{policyNumber}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[#f8f9fb] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-muted">Plan</p>
            <p className="mt-1 text-[15px] font-semibold text-navy-deep">{plan?.name ?? planId}</p>
          </div>
          <div className="rounded-xl bg-[#f8f9fb] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-muted">Annual premium</p>
            <p className="mt-1 text-[15px] font-semibold tabular-nums text-navy-deep">CA${fmtNumber(annualPremium)}</p>
          </div>
          <div className="rounded-xl bg-[#f8f9fb] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-muted">Policy limit</p>
            <p className="mt-1 text-[15px] font-semibold tabular-nums text-navy-deep">{fmtLimit(limit)}</p>
          </div>
          <div className="rounded-xl bg-[#f8f9fb] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-muted">Deductible</p>
            <p className="mt-1 text-[15px] font-semibold tabular-nums text-navy-deep">CA${fmtNumber(deductible)}</p>
          </div>
          <div className="rounded-xl bg-[#f8f9fb] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-muted">Effective date</p>
            <p className="mt-1 text-[15px] font-semibold text-navy-deep">{effectiveDate}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-xl border border-navy-deep/10 px-4 py-4">
          <ScoreGauge score={score} size="sm" showLabel={false} />
          <div>
            <p className="text-[12px] text-ink-muted">Cyber risk score</p>
            <p className="text-[15px] font-semibold" style={{ color: grade.color }}>
              {score}/100 · {grade.label}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">Business profile</p>
          <dl className="mt-3 space-y-2.5">
            {SUMMARY_FIELDS.map(({ id, label }) => {
              const value = getAnswerSummary(id, answers)
              if (!value) return null
              return (
                <div key={id} className="flex justify-between gap-4 text-[13px]">
                  <dt className="text-ink-muted">{label}</dt>
                  <dd className="max-w-[60%] text-right font-medium text-navy-deep">{value}</dd>
                </div>
              )
            })}
          </dl>
        </div>

        {tradeLicenseName && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#f8f9fb] px-4 py-3 text-[13px] text-navy-deep">
            <ShieldCheck className="size-4 shrink-0 text-[#1976FF]" />
            Business registration verified: {tradeLicenseName}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-navy-deep/10 py-3 text-[14px] font-semibold text-navy-deep transition hover:bg-navy-deep/5"
          >
            <Download className="size-4" />
            Download policy PDF
          </button>
          <Link
            to="/"
            className="flex flex-1 items-center justify-center rounded-xl bg-navy-deep py-3 text-[14px] font-semibold text-white transition hover:bg-navy"
          >
            Back to home
          </Link>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-[12px] text-white/40"
      >
        Demo policy · Not valid for insurance claims
      </motion.p>
    </QuoteCheckoutShell>
  )
}
