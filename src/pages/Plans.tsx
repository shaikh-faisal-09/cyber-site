import { useMemo } from 'react'
import { SEO } from '@/components/site/SEO'
import { QuotePlansPanel } from '@/components/quote/QuotePlansPanel'
import { useQuote, calcScore, estimatePremium } from '@/lib/quote-store'
import { Footer } from '@/components/site/Footer'

export default function PlansPage() {
  const { answers, policyLimitIndex, planDeductibles, acceptedImprovements, setPolicyLimitIndex, setPlanDeductible, toggleAcceptedImprovement } =
    useQuote()
  const score = useMemo(() => calcScore(answers), [answers])
  const premium = useMemo(() => estimatePremium(answers, score), [answers, score])

  return (
    <>
      <SEO
        title="Choose your plan — Sentrix"
        description="Compare Basic, Value, and Premium cyber insurance plans."
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
        onSelectPlan={() => { }}
      />
      <Footer />
    </>
  )
}
