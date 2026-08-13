import { PickerCard } from './PickerCard'
import type { LucideIcon } from 'lucide-react'
import { User, Users, Building2, Briefcase, Factory, Globe } from 'lucide-react'

type OptionChipProps = {
  label: string
  selected?: boolean
  onClick: () => void
  icon?: LucideIcon
  iconBg?: string
}

export function OptionChip(props: OptionChipProps) {
  return <PickerCard layout="chip" {...props} />
}

export const REVENUE_CHIPS = [
  { value: 500_000, label: '$500K', bg: '#6366f1' },
  { value: 1_000_000, label: '$1M', bg: '#0ea5e9' },
  { value: 2_500_000, label: '$2.5M', bg: '#14b8a6' },
  { value: 5_000_000, label: '$5M', bg: '#8b5cf6' },
  { value: 10_000_000, label: '$10M', bg: '#f59e0b' },
  { value: 25_000_000, label: '$25M', bg: '#ec4899' },
  { value: 50_000_000, label: '$50M+', bg: '#059669' },
] as const

export const EMPLOYEE_CHIPS = [
  { value: 10, label: '1–10', bg: '#6366f1', icon: User },
  { value: 25, label: '11–25', bg: '#0ea5e9', icon: Users },
  { value: 50, label: '26–50', bg: '#14b8a6', icon: Building2 },
  { value: 100, label: '51–100', bg: '#8b5cf6', icon: Briefcase },
  { value: 250, label: '101–250', bg: '#f59e0b', icon: Factory },
  { value: 500, label: '250+', bg: '#ec4899', icon: Globe },
] as const
