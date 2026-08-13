import { Link } from 'react-router-dom'
import { Container } from './Container'

const columns = {
  Product: [
    { label: 'Coverage', to: '/#coverage' },
    { label: 'Plans', to: '/plans' },
    { label: 'Pricing', to: '/plans' },
    { label: 'Claims', to: '#' },
  ],
  Company: [
    { label: 'About', to: '#' },
    { label: 'Careers', to: '#' },
    { label: 'Press', to: '#' },
    { label: 'Contact', to: '#' },
  ],
  Resources: [
    { label: 'Blog', to: '#' },
    { label: 'Cyber Health Check', to: '/quote' },
    { label: 'Security Center', to: '#' },
    { label: 'Docs', to: '#' },
  ],
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-cream grain">
      <Container className="section-pad !pb-12">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_2fr]">
          <div className="space-y-6">
            <p className="font-display text-4xl font-light tracking-tight md:text-5xl">
              Sentrix
            </p>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
              Modern cyber insurance for growing businesses. Get covered in minutes, not weeks.
            </p>
            <ButtonLink />
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {Object.entries(columns).map(([title, links]) => (
              <div key={title}>
                <p className="label-caps mb-5">{title}</p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {year} Sentrix Insurance. All rights reserved.
          </p>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Security'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 border-t border-border pt-6">
          <span className="text-sm text-muted-foreground">Powered by Salus Insurance Services</span>
          <img src="/logos/slaus-insurance-logo.webp" alt="Salus Insurance Services" className="h-8 w-auto" />
        </div>
      </Container>
    </footer>
  )
}

function ButtonLink() {
  return (
    <Link
      to="/quote"
      className="inline-flex items-center gap-2 border-b border-foreground pb-0.5 text-sm font-medium transition-opacity hover:opacity-60"
    >
      Get my quote →
    </Link>
  )
}
