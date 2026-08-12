import { useRef } from 'react'
import { motion } from 'motion/react'
import { FileText, Upload, Check, ArrowRight } from 'lucide-react'
import { QuoteCheckoutShell } from './QuoteCheckoutShell'

type QuoteDocCollectionPanelProps = {
  fileName: string | null
  onFileSelect: (name: string | null) => void
  onBack: () => void
  onContinue: () => void
}

export function QuoteDocCollectionPanel({
  fileName,
  onFileSelect,
  onBack,
  onContinue,
}: QuoteDocCollectionPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    onFileSelect(file?.name ?? null)
  }

  return (
    <QuoteCheckoutShell
      title="Upload your business registration"
      subtitle="Required for Canadian business verification before policy issuance."
      stepLabel="Documents"
      onBack={onBack}
    >
      <div className="rounded-[20px] bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3 rounded-xl border border-[#1976FF]/20 bg-[#1976FF]/5 px-4 py-3">
          <FileText className="mt-0.5 size-4 shrink-0 text-[#1976FF]" />
          <div>
            <p className="text-[13px] font-medium text-navy-deep">Business registration</p>
            <p className="mt-0.5 text-[12px] text-ink-muted">
              Upload a clear PDF or image of your valid Canadian business registration.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-navy-deep/15 px-6 py-10 transition hover:border-[#1976FF]/40 hover:bg-[#1976FF]/5"
        >
          {fileName ? (
            <>
              <span className="flex size-12 items-center justify-center rounded-full bg-[#22c55e]/10">
                <Check className="size-6 text-[#16a34a]" />
              </span>
              <span className="text-[14px] font-medium text-navy-deep">{fileName}</span>
              <span className="text-[12px] text-ink-muted">Tap to replace</span>
            </>
          ) : (
            <>
              <span className="flex size-12 items-center justify-center rounded-full bg-navy-deep/5">
                <Upload className="size-6 text-navy-deep/60" />
              </span>
              <span className="text-[14px] font-medium text-navy-deep">Choose file or drag here</span>
              <span className="text-[12px] text-ink-muted">PDF, JPG or PNG · max 10 MB</span>
            </>
          )}
        </button>

        <motion.button
          type="button"
          onClick={onContinue}
          disabled={!fileName}
          whileTap={{ scale: 0.98 }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-deep py-3.5 text-[14px] font-semibold text-white transition hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to policy
          <ArrowRight className="size-4" />
        </motion.button>
      </div>
    </QuoteCheckoutShell>
  )
}
