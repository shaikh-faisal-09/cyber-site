import { Link } from 'react-router-dom'
import { ArrowLeft, X, RotateCcw } from 'lucide-react'

type QuoteCheckoutShellProps = {
  title: string
  subtitle?: string
  stepLabel: string
  onBack?: () => void
  onRestart?: () => void
  children: React.ReactNode
}

export function QuoteCheckoutShell({
  title,
  subtitle,
  stepLabel,
  onBack,
  onRestart,
  children,
}: QuoteCheckoutShellProps) {
  return (
    <div className="quote-shell flex h-[100dvh] flex-col overflow-hidden">
      <nav className="flex h-12 shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/15"
              aria-label="Go back"
            >
              <ArrowLeft className="size-4" />
            </button>
          ) : (
            <Link to="/" className="text-[15px] font-semibold text-white">
              Sentrix
            </Link>
          )}
        </div>
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">{stepLabel}</span>
        <div className="flex items-center gap-2">
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
          <Link
            to="/"
            className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md hover:bg-white/15 hover:text-white"
            aria-label="Exit"
          >
            <X className="size-4" />
          </Link>
        </div>
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 lg:p-5">
        <div className="mx-auto max-w-2xl space-y-4 sm:space-y-5">
          <div className="quote-question-card overflow-hidden rounded-[20px] px-5 py-5 sm:px-7 sm:py-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">{stepLabel}</p>
            <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-white sm:text-[26px]">{title}</h1>
            {subtitle && <p className="mt-2 text-[14px] text-white/50">{subtitle}</p>}
          </div>
          {children}
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
