import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Container } from './Container'

type HeaderProps = {
  variant?: 'light' | 'dark' | 'minimal'
}

const navLinks = [
  { label: 'Coverage', to: '/', hash: 'coverage' },
  { label: 'How it works', to: '/', hash: 'how' },
  { label: 'FAQ', to: '/', hash: 'faq' },
]

export function Header({ variant = 'light' }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const isProduction = !import.meta.env.DEV
  const homeUrl = isProduction ? 'https://salus-insurance-services.vercel.app/' : '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const onDark = variant === 'dark'

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled && !onDark && 'bg-paper/90 backdrop-blur-md shadow-soft',
        )}
      >
        <Container className="flex h-[72px] items-center justify-between lg:h-20">
          <Link
            to="/"
            className="font-display text-xl tracking-tight text-foreground lg:text-2xl"
            aria-label="Sentrix home"
          >
            Sentrix
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-paper/80 p-1 backdrop-blur-md md:flex"
            aria-label="Main"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.hash ? { pathname: link.to, hash: link.hash } : link.to}
                className={cn(
                  'rounded-full px-4 py-2 text-[13px] font-medium transition-colors',
                  location.pathname === link.to && !link.hash
                    ? 'bg-ink text-white'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant={onDark ? 'inverse' : 'default'}
              shape="pill"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <a href={homeUrl} target={isProduction ? '_blank' : undefined} rel={isProduction ? 'noopener noreferrer' : undefined}>
                <Home className="mr-2 size-4" />
                Home
              </a>
            </Button>
            <Button asChild variant={onDark ? 'inverse' : 'default'} shape="pill" size="sm" className="hidden sm:inline-flex">
              <Link to="/quote">Get my quote</Link>
            </Button>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full border border-border md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-0 top-[72px] z-40 border-b border-border bg-paper p-6 md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              <Button asChild variant="default" shape="pill" className="w-full">
                <a href={homeUrl} target={isProduction ? '_blank' : undefined} rel={isProduction ? 'noopener noreferrer' : undefined}>
                  <Home className="mr-2 size-4" />
                  Home
                </a>
              </Button>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.hash ? { pathname: link.to, hash: link.hash } : link.to}
                  className="rounded-lg px-4 py-3 text-base font-medium hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild variant="default" shape="pill" className="mt-4 w-full">
                <Link to="/quote">Get my quote</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
