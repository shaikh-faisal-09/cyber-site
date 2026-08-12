import { useState } from 'react'
import { motion } from 'motion/react'
import { CreditCard, Lock, ArrowRight } from 'lucide-react'
import { QuoteCheckoutShell } from './QuoteCheckoutShell'
import { fmtNumber } from '@/lib/utils'
import type { PlanId } from '@/lib/quote-store'
import { PLANS } from '@/lib/quote-store'

type QuotePaymentPanelProps = {
  planId: PlanId
  annualPremium: number
  onBack: () => void
  onComplete: () => void
}

export function QuotePaymentPanel({ planId, annualPremium, onBack, onComplete }: QuotePaymentPanelProps) {
  const [processing, setProcessing] = useState(false)
  const plan = PLANS.find((p) => p.id === planId)

  const handlePay = () => {
    setProcessing(true)
    window.setTimeout(() => {
      setProcessing(false)
      onComplete()
    }, 1400)
  }

  return (
    <QuoteCheckoutShell
      title="Complete your payment"
      subtitle="This is a demo checkout — no real charge will be made."
      stepLabel="Payment"
      onBack={onBack}
    >
      <div className="rounded-[20px] bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between border-b border-[#f2f2f7] pb-4">
          <div>
            <p className="text-[13px] text-ink-muted">{plan?.name ?? 'Selected'} plan</p>
            <p className="mt-0.5 font-display text-2xl tabular-nums text-navy-deep">
              CA${fmtNumber(annualPremium)}
              <span className="text-sm text-ink-muted">/yr</span>
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-[#1976FF]/10">
            <CreditCard className="size-5 text-[#1976FF]" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-medium text-ink-muted">Cardholder name</label>
            <input
              type="text"
              defaultValue="John Smith"
              className="mt-1.5 w-full rounded-xl border border-navy-deep/10 px-4 py-3 text-[14px] text-navy-deep outline-none focus:border-[#1976FF]/40"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-ink-muted">Card number</label>
            <input
              type="text"
              defaultValue="4242 4242 4242 4242"
              className="mt-1.5 w-full rounded-xl border border-navy-deep/10 px-4 py-3 text-[14px] text-navy-deep outline-none focus:border-[#1976FF]/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-ink-muted">Expiry</label>
              <input
                type="text"
                defaultValue="12/28"
                className="mt-1.5 w-full rounded-xl border border-navy-deep/10 px-4 py-3 text-[14px] text-navy-deep outline-none focus:border-[#1976FF]/40"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-ink-muted">CVC</label>
              <input
                type="text"
                defaultValue="123"
                className="mt-1.5 w-full rounded-xl border border-navy-deep/10 px-4 py-3 text-[14px] text-navy-deep outline-none focus:border-[#1976FF]/40"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#f8f9fb] px-4 py-3 text-[12px] text-ink-muted">
          <Lock className="size-3.5 shrink-0 text-[#16a34a]" />
          Secured with 256-bit encryption. Demo payment only.
        </div>

        <motion.button
          type="button"
          onClick={handlePay}
          disabled={processing}
          whileTap={{ scale: 0.98 }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-deep py-3.5 text-[14px] font-semibold text-white transition hover:bg-navy disabled:opacity-70"
        >
          {processing ? 'Processing…' : `Pay CA$${fmtNumber(annualPremium)}`}
          {!processing && <ArrowRight className="size-4" />}
        </motion.button>
      </div>
    </QuoteCheckoutShell>
  )
}
