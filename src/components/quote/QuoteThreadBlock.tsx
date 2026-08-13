import type { LucideIcon } from 'lucide-react'
import { Pencil } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { QuoteStepHelp } from './QuoteStepHelp'

type QuoteThreadBlockProps = {
  icon: LucideIcon
  title: string
  subtitle?: string
  stepId: string
  stepTip?: string
  stepNumber: number
  active: boolean
  past: boolean
  answered: boolean
  summary: string | null
  onEdit: () => void
  children?: React.ReactNode
}

export function QuoteThreadBlock({
  icon: Icon,
  title,
  subtitle,
  stepId,
  stepTip,
  stepNumber,
  active,
  past,
  answered,
  summary,
  onEdit,
  children,
}: QuoteThreadBlockProps) {
  return (
    <motion.section
      layout
      data-quote-active={active ? '' : undefined}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'border-b border-navy-deep/10 py-8 first:pt-2',
        past && !active && 'opacity-50 transition-opacity hover:opacity-80',
        active && 'opacity-100',
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
            active ? 'bg-navy-deep/10 text-navy-deep' : 'bg-navy-deep/5 text-ink-muted',
          )}
        >
          <Icon className="size-4" strokeWidth={1.75} aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
            Question {stepNumber}
          </p>

          {active && !answered ? (
            <QuoteStepHelp
              stepId={stepId}
              stepTitle={title}
              stepSubtitle={subtitle}
              stepTip={stepTip}
              answered={answered}
              showToggle={stepId !== 'employees'}
            >
              {({ toggle, panel }) => (
                <>
                  <div className="mt-1 flex items-start justify-between gap-3 sm:gap-4">
                    <h2 className="min-w-0 flex-1 text-[17px] font-semibold leading-snug tracking-tight text-navy-deep sm:text-[19px]">
                      {title}
                    </h2>
                    {toggle}
                  </div>
                  {subtitle && (
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                      {stepId === 'cloudServices' ? (
                        <>
                          e.g.{' '}
                          <img src="/logos/microsoft.svg" alt="Microsoft" className="inline-block h-4 w-auto align-middle mx-1" />
                          Microsoft 365,{' '}
                          <img src="/logos/google.svg" alt="Google" className="inline-block h-4 w-auto align-middle mx-1" />
                          Google Workspace,{' '}
                          <img src="/logos/aws.svg" alt="AWS" className="inline-block h-4 w-auto align-middle mx-1" />
                          AWS
                        </>
                      ) : (
                        subtitle
                      )}
                    </p>
                  )}
                  {panel && <div className="mt-4">{panel}</div>}
                </>
              )}
            </QuoteStepHelp>
          ) : (
            <>
              <h2
                className={cn(
                  'mt-1 text-[17px] font-semibold leading-snug tracking-tight sm:text-[19px]',
                  active ? 'text-navy-deep' : 'text-ink-muted',
                )}
              >
                {title}
              </h2>
              {active && subtitle && (
                <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                  {stepId === 'cloudServices' ? (
                    <>
                      e.g.{' '}
                      <img src="/logos/microsoft.svg" alt="Microsoft" className="inline-block h-4 w-auto align-middle mx-1" />
                      Microsoft 365,{' '}
                      <img src="/logos/google.svg" alt="Google" className="inline-block h-4 w-auto align-middle mx-1" />
                      Google Workspace,{' '}
                      <img src="/logos/aws.svg" alt="AWS" className="inline-block h-4 w-auto align-middle mx-1" />
                      AWS
                    </>
                  ) : (
                    subtitle
                  )}
                </p>
              )}
            </>
          )}

          {past && !active && summary && (
            <button
              type="button"
              onClick={onEdit}
              className="group mt-4 flex w-full items-start justify-between gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-navy-deep/[0.04]"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted/80">Your answer</p>
                <p className="mt-1 text-[15px] font-medium leading-snug text-ink-muted group-hover:text-navy-deep">
                  {summary}
                </p>
              </div>
              <span className="mt-1 flex shrink-0 items-center gap-1 text-[12px] font-medium text-ink-muted group-hover:text-electric">
                <Pencil className="size-3.5" />
                Edit
              </span>
            </button>
          )}

          {active && children && <div className="mt-5">{children}</div>}
        </div>
      </div>
    </motion.section>
  )
}
