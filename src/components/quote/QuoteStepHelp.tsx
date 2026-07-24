import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircleQuestion, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type ChatMessage,
  createId,
  generateAssistantReply,
  getStepContext,
} from '@/lib/quote-assistant'

type QuoteStepHelpProps = {
  stepId: string
  stepTitle: string
  stepSubtitle?: string
  stepTip?: string
  answered: boolean
  showToggle?: boolean
  className?: string
  children?: (parts: { toggle: ReactNode; panel: ReactNode }) => ReactNode
}

export function QuoteStepHelp({
  stepId,
  stepTitle,
  stepSubtitle,
  stepTip,
  answered,
  showToggle = true,
  className,
  children,
}: QuoteStepHelpProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevStepRef = useRef('')

  const step = { id: stepId, title: stepTitle, subtitle: stepSubtitle, tip: stepTip }
  const context = getStepContext(step)

  useEffect(() => {
    if (prevStepRef.current === stepId) return
    prevStepRef.current = stepId
    setOpen(false)
    setMessages([])
    setTyping(false)
  }, [stepId])

  useEffect(() => {
    if (answered) setOpen(false)
  }, [answered])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [])

  useEffect(() => {
    if (open) scrollToBottom()
  }, [messages, typing, open, scrollToBottom])

  const addAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: createId(), role: 'assistant', content, timestamp: new Date() },
    ])
  }, [])

  const askSuggestion = useCallback(
    async (text: string) => {
      if (typing) return
      if (!open) setOpen(true)
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: 'user', content: text, timestamp: new Date() },
      ])
      setTyping(true)
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300))
      addAssistantMessage(generateAssistantReply(text, step))
      setTyping(false)
    },
    [typing, step, addAssistantMessage, open],
  )

  const openHelp = () => {
    setOpen(true)
    setMessages((prev) =>
      prev.length > 0
        ? prev
        : [{ id: createId(), role: 'assistant', content: context.intro, timestamp: new Date() }],
    )
  }

  if (answered) return null

  if (!showToggle) {
    return children ? <>{children({ toggle: null, panel: null })}</> : null
  }

  const toggle = (
    <AnimatePresence mode="wait" initial={false}>
      {!open && (
        <motion.button
          key="toggle"
          type="button"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          onClick={openHelp}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-electric/20 bg-electric/[0.06] px-3 py-1.5 text-[12px] font-medium text-electric transition hover:border-electric/35 hover:bg-electric/10 sm:gap-2 sm:px-4 sm:py-2 sm:text-[13px]"
        >
          <MessageCircleQuestion className="size-3.5 opacity-80 sm:size-4" aria-hidden />
          <span className="hidden sm:inline">Need help?</span>
          <span className="sm:hidden">Get help</span>
        </motion.button>
      )}
    </AnimatePresence>
  )

  const panel = (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl border border-navy-deep/10 bg-white shadow-soft"
        >
          <div className="flex items-center justify-between gap-3 border-b border-navy-deep/8 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-electric/10 text-electric">
                <Sparkles className="size-3.5" aria-hidden />
              </span>
              <p className="text-[13px] font-semibold text-navy-deep">Sentrix Guide</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[12px] font-medium text-ink-muted transition hover:text-navy-deep"
            >
              Minimize
            </button>
          </div>

          <div ref={scrollRef} className="max-h-52 space-y-3 overflow-y-auto px-4 py-3" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                    msg.role === 'user'
                      ? 'rounded-tr-sm bg-navy-deep text-white'
                      : 'rounded-tl-sm bg-cream text-navy-deep',
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-cream px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="size-1.5 rounded-full bg-navy-deep/30"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {context.suggestions.length > 0 && !typing && (
            <div className="flex flex-wrap gap-2 border-t border-navy-deep/8 px-4 py-3">
              {context.suggestions.slice(0, 3).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => askSuggestion(s)}
                  className="rounded-full border border-border bg-paper px-3 py-1.5 text-left text-[12px] text-ink-muted transition hover:border-electric/30 hover:text-navy-deep"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (children) {
    return <>{children({ toggle, panel })}</>
  }

  return (
    <div className={cn('mt-4 space-y-4', className)}>
      {toggle}
      {panel}
    </div>
  )
}
