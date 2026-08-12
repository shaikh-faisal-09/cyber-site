import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import {
  ShieldCheck,
  Building2,
  DollarSign,
  Users,
  MapPin,
  Database,
  CreditCard,
  GraduationCap,
  KeyRound,
  ClipboardCheck,
  Cloud,
  Mail,
  Radar,
  AlertTriangle,
  FileCheck,
  Globe,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SEO } from '@/components/site/SEO'
import { AnswerGrid, AnswerGridFooter } from '@/components/quote/StepShell'
import { QuoteWizard } from '@/components/quote/QuoteWizard'
import { QuoteThreadBlock } from '@/components/quote/QuoteThreadBlock'
import { QuotePlansPanel } from '@/components/quote/QuotePlansPanel'
import { QuotePaymentPanel } from '@/components/quote/QuotePaymentPanel'
import { QuoteDocCollectionPanel } from '@/components/quote/QuoteDocCollectionPanel'
import { QuotePolicyPanel } from '@/components/quote/QuotePolicyPanel'
import { ChoiceButton } from '@/components/quote/ChoiceButton'
import { OptionChip, EMPLOYEE_CHIPS } from '@/components/quote/OptionChip'
import { YesNoUnsure } from '@/components/quote/YesNoUnsure'
import { ContinueButton } from '@/components/quote/ContinueButton'
import { TipBlock } from '@/components/quote/TipBlock'
import { Slider } from '@/components/ui/slider'
import {
  useQuote,
  useQuoteScore,
  estimatePremium,
  getPlanPremium,
  INDUSTRIES,
  OPERATES,
  DATA_TYPES,
  PROVINCES,
  STEP_LOADING,
  STEP_PLANS,
  STEP_PAYMENT,
  STEP_DOCS,
  STEP_POLICY,
  type PlanId,
} from '@/lib/quote-store'
import { isStepAnswered, getAnswerSummary } from '@/lib/quote-steps'
import { ADVANCE_DELAY } from '@/lib/utils'
import {
  INDUSTRY_ICONS,
  OPERATES_ICONS,
  DATA_TYPE_ICONS,
  getOptionIcon,
} from '@/lib/quote-option-icons'
import { getAcceptedPremiumDiscount } from '@/lib/premium-tips'

type StepDef = {
  id: string
  icon: LucideIcon
  title: string
  subtitle?: string
  tip?: string
}

const QUESTION_STEPS: StepDef[] = [
  {
    id: 'industry',
    icon: Building2,
    title: 'What best describes your business?',
    subtitle:
      "Let's build your cyber shield — a friendly 2-minute check. Pick the closest industry match and watch your score update live as you answer.",
  },
  { id: 'revenue', icon: DollarSign, title: "What's your annual revenue?" },
  { id: 'employees', icon: Users, title: 'How many people work at your company?' },
  { id: 'cloudServices', icon: Cloud, title: 'Do you use cloud services for email, files, or business apps?', subtitle: 'e.g. Microsoft 365, Google Workspace, AWS' },
  { id: 'operates', icon: MapPin, title: 'How does your team work?' },
  { id: 'data', icon: Database, title: 'What kind of sensitive data do you store?' },
  { id: 'payments', icon: CreditCard, title: 'Do you process online payments?' },
  {
    id: 'securityAwareness',
    icon: GraduationCap,
    title: 'Do employees receive annual cybersecurity training and phishing simulations?',
    subtitle: 'Training and simulated phishing are strong indicators of security culture.',
    tip: 'Combined training and phishing tests significantly reduce social engineering risk.',
  },
  {
    id: 'secureAccess',
    icon: KeyRound,
    title: 'Do employees use MFA and connect remotely through a company VPN?',
    subtitle: 'Multi-factor authentication plus VPN for remote access.',
    tip: 'MFA blocks over 99% of automated account attacks.',
  },
  {
    id: 'assetPatch',
    icon: ClipboardCheck,
    title: 'Do you maintain an asset inventory and install security updates within a month?',
    subtitle: 'Knowing your assets and patching promptly closes common gaps.',
  },
  {
    id: 'endpointControls',
    icon: AlertTriangle,
    title: 'Can employees install software without approval, or do you use unsupported legacy systems?',
    subtitle: 'Uncontrolled installs and end-of-life software increase breach risk.',
  },
  {
    id: 'backupRecovery',
    icon: Cloud,
    title: 'Is your data backed up regularly and have you tested restoring it?',
    tip: "Backups you haven't tested are just wishes. Restore-test at least once a year.",
  },
  {
    id: 'emailSecurity',
    icon: Mail,
    title: 'Are suspicious emails blocked and is your domain protected with SPF, DKIM and DMARC?',
    subtitle: 'Filtering plus domain authentication prevents impersonation.',
  },
  {
    id: 'endpointProtection',
    icon: ShieldCheck,
    title: 'Do all devices have endpoint protection with centralised threat monitoring?',
  },
  {
    id: 'incidentResponse',
    icon: Radar,
    title: 'Do you have a documented incident response plan reviewed every year?',
  },
  {
    id: 'province',
    icon: Globe,
    title: 'Which Canadian province or territory is your business registered in?',
    subtitle: 'Different provinces have varying privacy and data protection requirements.',
  },
  {
    id: 'pipedacompliance',
    icon: FileCheck,
    title: 'Are you compliant with PIPEDA (Canadian privacy law)?',
    subtitle: 'Personal Information Protection and Electronic Documents Act.',
    tip: 'PIPEDA compliance reduces regulatory risk and potential penalties.',
  },
  {
    id: 'quebecdatahandling',
    icon: FileCheck,
    title: 'Do you handle data from Quebec residents?',
    subtitle: 'Quebec has stricter privacy requirements under Bill 64 (Law 25).',
    tip: 'Quebec data handling requires additional consent and transparency measures.',
  },
]

const LOADING_CHECKS = [
  'Analyzing business profile…',
  'Benchmarking industry risk…',
  'Calibrating coverage…',
  'Finalizing your quote…',
]

const REVENUE_STEP_INDEX = QUESTION_STEPS.findIndex((step) => step.id === 'revenue')

const REVENUE_SLIDER_MIN = 0
const REVENUE_SLIDER_MAX = 50_000_000
const REVENUE_SLIDER_STEP = 100_000
const REVENUE_DEFAULT = 100_000

function formatCad(amount: number) {
  return `CA$ ${formatRevenueNumber(amount)}`
}

function formatRevenueNumber(amount: number) {
  return new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 }).format(amount)
}

const INDUSTRY_IMAGES: Record<(typeof INDUSTRIES)[number], string> = {
  Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  Healthcare: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
  Retail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
  Manufacturing: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80',
  Education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
  'Professional Services': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
  Construction: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
  Hospitality: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
  Logistics: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
  'Financial Services': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
  'Government Contractor': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80',
  Other: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
}

export default function QuotePage() {
  const {
    step,
    answers,
    selectedPlanId,
    selectedDeductible,
    planDeductibles,
    policyLimitIndex,
    tradeLicenseName,
    acceptedImprovements,
    setAnswer,
    setSelectedPlan,
    setPlanDeductible,
    setPolicyLimitIndex,
    setTradeLicense,
    setPaymentComplete,
    toggleAcceptedImprovement,
    next,
    prev,
    goto,
    reset,
  } = useQuote()
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [revenueInput, setRevenueInput] = useState('')
  const score = useQuoteScore()
  const premium = useMemo(() => estimatePremium(answers, score), [answers, score])
  const acceptedDiscount = useMemo(
    () => getAcceptedPremiumDiscount(acceptedImprovements),
    [acceptedImprovements],
  )
  const questionSteps = QUESTION_STEPS.length
  const isLoading = step === STEP_LOADING
  const isPlans = step === STEP_PLANS
  const isPayment = step === STEP_PAYMENT
  const isDocs = step === STEP_DOCS
  const isPolicy = step === STEP_POLICY

  const selectedPremium = useMemo(() => {
    if (!selectedPlanId) return premium
    return getPlanPremium(
      premium,
      selectedPlanId,
      policyLimitIndex,
      selectedDeductible ?? planDeductibles[selectedPlanId],
      acceptedDiscount,
    )
  }, [premium, selectedPlanId, policyLimitIndex, selectedDeductible, planDeductibles, acceptedDiscount])

  const progressPct =
    isPlans || isLoading || isPayment || isDocs || isPolicy
      ? 100
      : Math.round(((step + (isStepAnswered(QUESTION_STEPS[step]?.id ?? '', answers) ? 1 : 0)) / questionSteps) * 100)

  const maybeAdvance = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(next, ADVANCE_DELAY)
  }, [next])

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) return
    const timer = setTimeout(next, 2800)
    return () => clearTimeout(timer)
  }, [isLoading, next])

  useEffect(() => {
    if (step !== REVENUE_STEP_INDEX) return
    const defaultRevenue = answers.revenue ?? REVENUE_DEFAULT
    setRevenueInput(formatRevenueNumber(defaultRevenue))
    if (answers.revenue === undefined) setAnswer('revenue', defaultRevenue)
  }, [step])

  const handleSelectPlan = (planId: PlanId) => {
    setSelectedPlan(planId)
    next()
  }

  const renderYesNoStep = (
    field: keyof typeof answers,
    opts?: { includeUnsure?: boolean; showTipOn?: string },
  ) => (
    <>
      <YesNoUnsure
        includeUnsure={opts?.includeUnsure ?? true}
        value={answers[field] as string | undefined}
        onChange={(v) => {
          setAnswer(field, v)
          maybeAdvance()
        }}
      />
      {opts?.showTipOn && answers[field] === opts.showTipOn && (
        <TipBlock tip={QUESTION_STEPS.find((s) => s.id === field)?.tip ?? ''} />
      )}
    </>
  )

  const renderAnswers = (stepDef: StepDef) => {
    switch (stepDef.id) {
      case 'industry':
        return (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {INDUSTRIES.map((ind) => {
              const { icon, bg } = getOptionIcon(INDUSTRY_ICONS, ind)
              const selected = answers.industry === ind
              const Icon = icon
              return (
                <motion.button
                  key={ind}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  className={`group relative flex min-h-[158px] flex-col justify-between overflow-hidden rounded-2xl p-4 text-left transition sm:min-h-[170px] sm:p-5 ${selected
                    ? 'ring-2 ring-electric ring-offset-2 ring-offset-white'
                    : 'hover:-translate-y-1 hover:shadow-lg'
                    }`}
                  onClick={() => {
                    setAnswer('industry', ind)
                    maybeAdvance()
                  }}
                  aria-pressed={selected}
                >
                  <img
                    src={INDUSTRY_IMAGES[ind]}
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-65 transition duration-500 group-hover:scale-105 group-hover:opacity-80"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/60 to-navy-deep/15" aria-hidden />
                  <span
                    className="relative flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: bg }}
                  >
                    {Icon && <Icon className="size-5 text-white" strokeWidth={1.75} aria-hidden />}
                  </span>
                  <span className="relative mt-5 font-display text-base leading-snug text-white sm:text-lg">{ind}</span>
                </motion.button>
              )
            })}
          </div>
        )

      case 'revenue':
        const revenue = answers.revenue
        const sliderRevenue = Math.min(
          REVENUE_SLIDER_MAX,
          Math.max(REVENUE_SLIDER_MIN, revenue ?? REVENUE_DEFAULT),
        )
        return (
          <div className="rounded-3xl border border-navy/10 bg-white p-5 shadow-[0_12px_40px_rgba(6,26,64,0.08)] sm:p-7">
            <div className="flex flex-col gap-1 border-b border-navy/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-navy/65">Estimated annual revenue</p>
                <p className="mt-1 text-xs text-navy/45">Drag the slider or enter an exact amount below.</p>
              </div>
              <output className="font-display text-2xl font-semibold text-navy sm:text-3xl">
                {formatCad(revenue ?? sliderRevenue)}
              </output>
            </div>

            <div className="py-7">
              <Slider
                min={REVENUE_SLIDER_MIN}
                max={REVENUE_SLIDER_MAX}
                step={REVENUE_SLIDER_STEP}
                value={[sliderRevenue]}
                onValueChange={([value]) => {
                  setAnswer('revenue', value)
                  setRevenueInput(formatRevenueNumber(value))
                }}
                aria-label="Annual revenue in CAD"
              />
            </div>

            <label className="block">
              <span className="text-sm font-medium text-navy">Or enter your annual revenue</span>
              <span className="mt-2 flex items-center overflow-hidden rounded-xl border border-navy/15 bg-[#f8fafc] transition focus-within:border-electric focus-within:ring-2 focus-within:ring-electric/15">
                <span className="border-r border-navy/10 px-4 py-3 text-sm font-semibold text-navy/65">CA$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={revenueInput}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, '')
                    setRevenueInput(digits ? formatRevenueNumber(Number(digits)) : '')
                    setAnswer('revenue', digits ? Number(digits) : undefined)
                  }}
                  placeholder="e.g. 2500000"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base font-medium text-navy outline-none placeholder:text-navy/35"
                  aria-describedby="revenue-input-help"
                />
              </span>
              <span id="revenue-input-help" className="mt-2 block text-xs text-navy/45">
                Enter numbers only. Amounts above CA$ 50,000,000 are accepted.
              </span>
            </label>

            <div className="mt-6">
              <ContinueButton onClick={next} disabled={!revenue || revenue <= 0} />
            </div>
          </div>
        )

      case 'employees':
        return (
          <AnswerGrid cols={3}>
            {EMPLOYEE_CHIPS.map(({ value, label, bg }) => (
              <OptionChip
                key={value}
                label={label}
                icon={Users}
                iconBg={bg}
                selected={answers.employees === value}
                onClick={() => {
                  setAnswer('employees', value)
                  maybeAdvance()
                }}
              />
            ))}
          </AnswerGrid>
        )

      case 'cloudServices':
        return (
          <YesNoUnsure
            value={answers.cloudServices}
            onChange={(v) => {
              setAnswer('cloudServices', v)
              maybeAdvance()
            }}
          />
        )

      case 'operates':
        return (
          <AnswerGrid cols={1}>
            {OPERATES.map((o) => {
              const { icon, bg } = getOptionIcon(OPERATES_ICONS, o)
              return (
                <ChoiceButton
                  key={o}
                  label={o}
                  icon={icon}
                  iconBg={bg}
                  selected={answers.operates === o}
                  onClick={() => {
                    setAnswer('operates', o)
                    maybeAdvance()
                  }}
                />
              )
            })}
          </AnswerGrid>
        )

      case 'data': {
        const selected = answers.data ?? []
        const toggle = (item: string) => {
          const nextData = selected.includes(item)
            ? selected.filter((d) => d !== item)
            : [...selected, item]
          setAnswer('data', nextData)
        }
        return (
          <AnswerGrid hint="Pick all that apply">
            {DATA_TYPES.map((d) => {
              const { icon, bg } = getOptionIcon(DATA_TYPE_ICONS, d)
              return (
                <ChoiceButton
                  key={d}
                  label={d}
                  icon={icon}
                  iconBg={bg}
                  selected={selected.includes(d)}
                  onClick={() => toggle(d)}
                />
              )
            })}
            <AnswerGridFooter>
              <ContinueButton onClick={next} disabled={selected.length === 0} />
            </AnswerGridFooter>
          </AnswerGrid>
        )
      }

      case 'payments':
        return renderYesNoStep('payments', { includeUnsure: false })

      case 'securityAwareness':
        return renderYesNoStep('securityAwareness')

      case 'secureAccess':
        return renderYesNoStep('secureAccess', { showTipOn: 'no' })

      case 'assetPatch':
        return renderYesNoStep('assetPatch')

      case 'endpointControls':
        return renderYesNoStep('endpointControls', { includeUnsure: false })

      case 'backupRecovery':
        return renderYesNoStep('backupRecovery', { showTipOn: 'no', includeUnsure: false })

      case 'emailSecurity':
        return renderYesNoStep('emailSecurity')

      case 'endpointProtection':
        return renderYesNoStep('endpointProtection', { includeUnsure: false })

      case 'incidentResponse':
        return renderYesNoStep('incidentResponse', { includeUnsure: false })

      case 'province':
        return (
          <AnswerGrid cols={1}>
            {PROVINCES.map((p) => (
              <ChoiceButton
                key={p}
                label={p}
                icon={MapPin}
                iconBg="#1976FF"
                selected={answers.province === p}
                onClick={() => {
                  setAnswer('province', p)
                  maybeAdvance()
                }}
              />
            ))}
          </AnswerGrid>
        )

      case 'pipedacompliance':
        return renderYesNoStep('pipedacompliance' as keyof typeof answers, { showTipOn: 'no' })

      case 'quebecdatahandling':
        return renderYesNoStep('quebecdatahandling' as keyof typeof answers, { showTipOn: 'yes' })

      default:
        return null
    }
  }

  if (isPolicy && selectedPlanId) {
    return (
      <>
        <SEO title="Policy issued — Sentrix" description="Your cyber insurance policy is ready." noindex />
        <QuotePolicyPanel
          answers={answers}
          score={score}
          planId={selectedPlanId}
          limitIndex={policyLimitIndex}
          deductible={selectedDeductible ?? planDeductibles[selectedPlanId]}
          annualPremium={selectedPremium}
          tradeLicenseName={tradeLicenseName}
          onBack={() => goto(STEP_DOCS)}
          onRestart={reset}
        />
      </>
    )
  }

  if (isDocs) {
    return (
      <>
        <SEO title="Upload documents — Sentrix" description="Upload your business registration to complete your policy." noindex />
        <QuoteDocCollectionPanel
          fileName={tradeLicenseName}
          onFileSelect={setTradeLicense}
          onBack={() => goto(STEP_PAYMENT)}
          onRestart={reset}
          onContinue={next}
        />
      </>
    )
  }

  if (isPayment && selectedPlanId) {
    return (
      <>
        <SEO title="Payment — Sentrix" description="Complete your cyber insurance purchase." noindex />
        <QuotePaymentPanel
          planId={selectedPlanId}
          annualPremium={selectedPremium}
          onBack={() => goto(STEP_PLANS)}
          onRestart={reset}
          onComplete={() => {
            setPaymentComplete(true)
            next()
          }}
        />
      </>
    )
  }

  if (isPlans) {
    return (
      <>
        <SEO
          title="Choose your plan — Sentrix"
          description="Compare Basic, Value, and Premium cyber insurance plans."
          noindex
        />
        <QuotePlansPanel
          score={score}
          basePremium={premium}
          answers={answers}
          limitIndex={policyLimitIndex}
          planDeductibles={planDeductibles}
          acceptedImprovements={acceptedImprovements}
          onLimitChange={setPolicyLimitIndex}
          onDeductibleChange={setPlanDeductible}
          onToggleImprovement={toggleAcceptedImprovement}
          onSelectPlan={handleSelectPlan}
          onBack={() => goto(STEP_LOADING)}
          onRestart={reset}
        />
      </>
    )
  }

  return (
    <>
      <SEO
        title="Get your quote — Sentrix"
        description="A friendly cyber health check that ends with an instant quote."
        noindex
      />

      <QuoteWizard
        activeStep={Math.min(step, questionSteps - 1)}
        questionSteps={questionSteps}
        progressPct={progressPct}
        score={score}
        isLoading={isLoading}
        canGoBack={step > 0 && !isLoading}
        onBack={prev}
        onRestart={reset}
      >
        {(isLoading ? QUESTION_STEPS : QUESTION_STEPS.slice(0, step + 1)).map((stepDef, i) => (
          <QuoteThreadBlock
            key={stepDef.id}
            icon={stepDef.icon}
            title={stepDef.title}
            subtitle={stepDef.subtitle}
            stepId={stepDef.id}
            stepTip={'tip' in stepDef ? stepDef.tip : undefined}
            stepNumber={i + 1}
            active={!isLoading && i === step}
            past={isLoading || i < step}
            answered={isStepAnswered(stepDef.id, answers)}
            summary={getAnswerSummary(stepDef.id, answers)}
            onEdit={() => goto(i)}
          >
            {!isLoading && i === step ? renderAnswers(stepDef) : null}
          </QuoteThreadBlock>
        ))}

        {isLoading && (
          <motion.section
            data-quote-active
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-navy-deep/10 py-8"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">Processing</p>
            <h2 className="mt-1 text-[19px] font-semibold text-navy-deep">Generating your quote…</h2>
            <ul className="mt-6 space-y-4" aria-live="polite">
              {LOADING_CHECKS.map((check, i) => (
                <motion.li
                  key={check}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.35 }}
                  className="flex items-center gap-4 text-sm text-ink-muted"
                >
                  <span className="font-display text-xs tabular-nums text-ink-muted/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {check}
                </motion.li>
              ))}
            </ul>
          </motion.section>
        )}
      </QuoteWizard>
    </>
  )
}
