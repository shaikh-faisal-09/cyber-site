import { useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, X, RotateCcw, Home } from 'lucide-react'
import { motion } from 'motion/react'
import { ScoreGauge } from './ScoreGauge'
import { ScoreInsight, ScoreIntroHint, ScoreBenchmark } from './ScoreInsight'

type QuoteWizardProps = {
  activeStep: number
  questionSteps: number
  progressPct: number
  score: number
  isLoading: boolean
  canGoBack: boolean
  onBack: () => void
  onRestart?: () => void
  pageTitle?: string
  children: React.ReactNode
}

export function QuoteWizard({
  activeStep,
  questionSteps,
  progressPct,
  score,
  isLoading,
  canGoBack,
  onBack,
  onRestart,
  pageTitle = 'Get your cyber quote',
  children,
}: QuoteWizardProps) {
  const threadRef = useRef<HTMLDivElement>(null)
  const isProduction = !import.meta.env.DEV
  const homeUrl = isProduction ? 'https://salus-insurance-services.vercel.app/' : '/'

  const scrollActiveQuestionIntoView = useCallback(() => {
    const container = threadRef.current
    if (!container) return

    const activeEl = container.querySelector('[data-quote-active]') as HTMLElement | null
    if (!activeEl) return

    const offset = 20
    const containerRect = container.getBoundingClientRect()
    const elRect = activeEl.getBoundingClientRect()
    const nextScroll = container.scrollTop + (elRect.top - containerRect.top) - offset

    container.scrollTo({ top: Math.max(0, nextScroll), behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(scrollActiveQuestionIntoView, 80)
    return () => window.clearTimeout(timer)
  }, [activeStep, isLoading, scrollActiveQuestionIntoView])

  return (
    <div className="quote-shell flex h-[100dvh] flex-col overflow-hidden">
      <header className="relative z-20 shrink-0 border-b border-gold/20 bg-transparent px-4 pb-3 pt-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            {canGoBack ? (
              <button
                type="button"
                onClick={onBack}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/15"
                aria-label="Go back"
              >
                <ArrowLeft className="size-4" />
              </button>
            ) : (
              <a
                href={homeUrl}
                target={isProduction ? '_blank' : undefined}
                rel={isProduction ? 'noopener noreferrer' : undefined}
                className="shrink-0 text-[14px] font-semibold text-white/90 transition hover:text-white sm:text-[15px]"
              >
                Sentrix
              </a>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-[17px] font-semibold tracking-tight text-white sm:text-[19px]">
                {pageTitle}
              </h1>
              <p className="mt-0.5 text-[12px] text-white/45">
                {isLoading ? 'Finalizing' : `Step ${activeStep + 1} of ${questionSteps}`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 px-1">
            {Array.from({ length: 12 }).map((_, i) => {
              const mapped = Math.round((i / 11) * (questionSteps - 1))
              const done = mapped < activeStep || isLoading
              const active = mapped === activeStep && !isLoading
              return (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${active ? 'w-6 bg-white' : done ? 'w-2 bg-white/50' : 'w-1 bg-white/20'
                    }`}
                />
              )
            })}
          </div>

          <div className="flex shrink-0 items-start justify-end gap-2 sm:gap-3">
            <div
              className="group/score relative flex flex-col items-center gap-1.5 outline-none sm:items-end"
              tabIndex={0}
              aria-label={`Cyber risk score ${score} out of 100}`}
            >
              <ScoreGauge score={score} size="sm" inverted showLabel={false} />
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">Risk score</p>
              {score === 0 ? (
                <ScoreIntroHint inverted className="hidden sm:block" />
              ) : (
                <ScoreBenchmark score={score} inverted />
              )}
              <ScoreInsight score={score} inverted />
            </div>
            {onRestart && (
              <button
                type="button"
                onClick={onRestart}
                className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md hover:bg-white/15 hover:text-white"
                aria-label="Restart quote"
                title="Restart quote"
              >
                <RotateCcw className="size-4" />
              </button>
            )}
            <a
              href={homeUrl}
              target={isProduction ? '_blank' : undefined}
              rel={isProduction ? 'noopener noreferrer' : undefined}
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md hover:bg-white/15 hover:text-white"
              aria-label="Home"
              title="Home"
            >
              <Home className="size-4" />
            </a>
            <Link
              to="/"
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md hover:bg-white/15 hover:text-white"
              aria-label="Exit"
            >
              <X className="size-4" />
            </Link>
          </div>
        </div>

        {score === 0 ? (
          <div className="mt-2 border-t border-white/10 pt-2 sm:hidden">
            <ScoreIntroHint inverted className="mx-auto text-center" />
          </div>
        ) : (
          <div className="mt-2 border-t border-white/10 pt-2 sm:hidden">
            <ScoreBenchmark score={score} inverted className="mx-auto text-center" />
          </div>
        )}

        <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-white/10 sm:hidden">
          <motion.div
            className="h-full bg-white"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-2 pb-2 sm:px-3 sm:pb-3 lg:px-4 lg:pb-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] quote-thread-panel">
          <div
            ref={threadRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-10 sm:py-8 lg:px-12"
          >
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </div>
        </div>
      </div>
      <div className="shrink-0 border-t border-gold/20 bg-transparent px-4 py-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-white/70">Powered by Salus Insurance Services</span>
          <img src="/logos/slaus-insurance-logo.webp" alt="Salus Insurance Services" className="h-8 w-auto" />
        </div>
      </div>
    </div>
  )
}
