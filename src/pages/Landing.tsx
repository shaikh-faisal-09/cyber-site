import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import {
  ShieldCheck,
  ClipboardList,
  Activity,
  Lock,
  Database,
  DollarSign,
  Cpu,
  Users,
  LifeBuoy,
  ArrowRight,
  HeartPulse,
  ShoppingBag,
  Factory,
  Briefcase,
  GraduationCap,
  UtensilsCrossed,
  HardHat,
  Banknote,
  Truck,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  UserX,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SEO } from "@/components/site/SEO";
import { Container } from "@/components/site/Container";
import { TrustBadges } from "@/components/site/TrustBadges";
import { ScrollElasticSection } from "@/components/site/ScrollElasticSection";
import { CyberArticlesScroll } from "@/components/site/CyberArticlesScroll";
import { CyberDotsBackground } from "@/components/site/CyberDotsBackground";
import { SectionWaveBg } from "@/components/site/SectionWaveBg";
import { UndrawIllustration, SectionIllustration } from "@/components/site/UndrawIllustration";
import type { UndrawName } from "@/components/site/UndrawIllustration";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const certifications = ["ISO 27001", "SOC 2", "Live underwriting engine"];

const elasticSpring = { stiffness: 72, damping: 22, mass: 0.55 };
const revealSpring = { type: "spring" as const, stiffness: 110, damping: 16, mass: 0.7 };

const stats = [
  {
    label: "Cyberattacks blocked daily (UAE)",
    value: "90K–200K",
    unit: "/ day",
    detail: "Over 70% linked to state-sponsored actors",
    icon: ShieldAlert,
    accent: "#00C2FF",
    bg: "rgba(0,194,255,0.12)",
  },
  {
    label: "Peak daily attack volume",
    value: "700K",
    unit: "/ day",
    detail: "Q1 2026 regional tension peak",
    icon: TrendingUp,
    accent: "#f87171",
    bg: "rgba(248,113,113,0.12)",
    highlight: true,
  },
  {
    label: "Confirmed UAE threat incidents",
    value: "128",
    unit: "",
    detail: "By 18 Feb 2026 · ransomware, gov breaches & data leaks",
    icon: AlertTriangle,
    accent: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
  },
  {
    label: "Middle East average breach cost",
    value: "AED 26.4M",
    unit: "",
    detail: "Down ~18% from AED 32.1M · IBM Cost of a Data Breach 2025",
    icon: DollarSign,
    accent: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
  },
  {
    label: "UAE cyber insurance market",
    value: "AED 307.5M",
    unit: "",
    detail: "2025 · projected AED 1.29B by 2034 (17.23% CAGR)",
    icon: BarChart3,
    accent: "#c8f060",
    bg: "rgba(200,240,96,0.14)",
  },
  {
    label: "Human error factor",
    value: "98%",
    unit: "",
    detail: "Of successful attacks exploit human error",
    icon: UserX,
    accent: "#1976FF",
    bg: "rgba(25,118,255,0.12)",
  },
];

const steps = [
  {
    num: "01",
    title: "Describe your business",
    description: "A few smart questions — no jargon, no forms.",
    icon: ClipboardList,
  },
  {
    num: "02",
    title: "Get your cyber risk score",
    description: "Watch your score update live as you answer.",
    icon: Activity,
  },
  {
    num: "03",
    title: "Buy your policy instantly",
    description: "Sign, pay and download — all in one flow.",
    icon: ShieldCheck,
  },
];

const coverageItems = [
  {
    title: "Ransomware",
    icon: Lock,
    accent: "#1976FF",
    description:
      "System restoration, decryption support, and expert negotiation when attackers lock your files or networks.",
  },
  {
    title: "Data Breach",
    icon: Database,
    accent: "#00C2FF",
    description:
      "Notification costs, credit monitoring, and forensic investigation when customer or employee data is exposed.",
  },
  {
    title: "Business Interruption",
    icon: Activity,
    accent: "#c9a227",
    description:
      "Lost revenue and extra running costs while your operations are offline after a cyber incident.",
  },
  {
    title: "Cyber Extortion",
    icon: DollarSign,
    accent: "#7c3aed",
    description:
      "Ransom payments and specialist fees when criminals threaten to leak, encrypt, or destroy your data.",
  },
  {
    title: "Digital Asset Recovery",
    icon: Cpu,
    accent: "#059669",
    description:
      "Restore websites, databases, and cloud workloads damaged by malware, hacks, or corruption.",
  },
  {
    title: "Third Party Liability",
    icon: Users,
    accent: "#e11d48",
    description:
      "Legal defence and settlements if a client or partner sues following a breach involving your business.",
  },
  {
    title: "Incident Response",
    icon: LifeBuoy,
    accent: "#061a40",
    description:
      "24/7 breach coaches, forensics, and PR support from the moment you report an incident.",
  },
];

type CoverageItem = (typeof coverageItems)[number];

function CoverageRow({ item, index }: { item: CoverageItem; index: number }) {
  const reversed = index % 2 === 1;
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, x: reversed ? 24 : -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...revealSpring, delay: index * 0.06 }}
      className={[
        "group flex flex-col gap-8 overflow-hidden rounded-[1.75rem] border border-border/60 p-6 sm:flex-row sm:items-center sm:p-8 lg:gap-12 lg:p-10",
        reversed ? "sm:flex-row-reverse" : "",
        index % 2 === 0 ? "bg-white shadow-soft" : "bg-cream/40",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={`min-w-0 flex-1 ${reversed ? "sm:text-right" : ""}`}>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: item.accent }}
        >
          Coverage
        </p>
        <h3 className="mt-2 font-display text-2xl font-normal text-foreground lg:text-3xl">
          {item.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:text-base">
          {item.description}
        </p>
      </div>

      <div
        className={`flex shrink-0 items-center justify-center ${reversed ? "sm:justify-start" : "sm:justify-end"}`}
      >
        <motion.div
          className="relative flex size-28 items-center justify-center rounded-[1.5rem] ring-1 ring-black/5 lg:size-32"
          style={{ backgroundColor: `${item.accent}14`, color: item.accent }}
          whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: reversed ? -2 : 2 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <motion.div
            className="pointer-events-none absolute inset-3 rounded-[1.1rem] blur-xl"
            style={{ backgroundColor: item.accent }}
            aria-hidden
            animate={
              reduceMotion ? { opacity: 0.4 } : { scale: [1, 1.2, 1], opacity: [0.35, 0.55, 0.35] }
            }
            transition={{
              duration: 2.6 + index * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.12,
            }}
          />
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -6, 0], rotate: [0, 4, 0, -4, 0] }}
            transition={{
              duration: 3.2 + index * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          >
            <item.icon className="relative size-10 lg:size-11" strokeWidth={1.5} aria-hidden />
          </motion.div>
        </motion.div>
      </div>
    </motion.article>
  );
}

const industries = [
  {
    name: "Technology",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    description:
      "SaaS breaches, IP theft, and cloud misconfigurations expose code repos and customer data at scale.",
  },
  {
    name: "Healthcare",
    icon: HeartPulse,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    description:
      "Patient records and connected devices are prime targets for ransomware and privacy violations.",
  },
  {
    name: "Retail",
    icon: ShoppingBag,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    description:
      "POS skimming, e-commerce fraud, and payment card leaks disrupt sales and erode customer trust.",
  },
  {
    name: "Manufacturing",
    icon: Factory,
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
    description:
      "OT and supply chain systems face downtime when ransomware hits production lines and vendors.",
  },
  {
    name: "Professional Services",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
    description:
      "Client confidentiality breaches and email compromise put contracts, filings, and reputations at risk.",
  },
  {
    name: "Education",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    description:
      "Student data, research assets, and open campus networks invite phishing and data theft.",
  },
  {
    name: "Hospitality",
    icon: UtensilsCrossed,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    description:
      "Guest PII, booking systems, and POS terminals are exposed through turnover and shared devices.",
  },
  {
    name: "Construction",
    icon: HardHat,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
    description:
      "Project bids, subcontractor portals, and field tools create gaps in access control and data handling.",
  },
  {
    name: "Financial Services",
    icon: Banknote,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
    description:
      "Wire fraud, account takeover, and regulatory scrutiny demand robust fraud and breach response.",
  },
  {
    name: "Logistics",
    icon: Truck,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
    description:
      "Fleet tracking, warehouse systems, and shipment data face disruption from ransomware and supplier attacks.",
  },
];

const stepColors = ["#1976FF", "#00C2FF", "#c8f060"];

const stepIllustrations: UndrawName[] = [
  "secure-login",
  "two-factor-authentication",
  "cloud-hosting",
];

const industryColors = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#64748b",
  "#0ea5e9",
  "#8b5cf6",
  "#14b8a6",
  "#ea580c",
  "#059669",
  "#0284c7",
];

const faqs = [
  {
    q: "How fast can I get covered?",
    a: "Most businesses complete the entire journey in under five minutes and receive their policy documents immediately.",
  },
  {
    q: "What if I don't know a technical answer?",
    a: "Every question is rewritten in plain English with helpful examples. You can also select 'Not sure' — we'll guide you.",
  },
  {
    q: "Can I lower my premium later?",
    a: "Yes. Your Sentrix dashboard tracks security improvements. Each completed action can reduce your renewal premium.",
  },
  {
    q: "Which countries do you cover?",
    a: "We cover businesses across the UAE, GCC and select international markets. More geographies are being added.",
  },
  {
    q: "Is my data secure?",
    a: "All submissions are encrypted end-to-end. We are SOC 2 and ISO 27001 aligned, and never sell your data.",
  },
];

const cyberArticles = [
  {
    title: "If you pay a hacker's ransom, chances are that they'll come back for more",
    source: "TechCrunch",
    date: "Jul 2026",
    excerpt:
      "Proofpoint found over one-third of companies that paid a ransom were hit with a second extortion demand — underscoring why recovery planning beats paying alone.",
    url: "https://techcrunch.com/2026/07/22/if-you-pay-a-hackers-ransom-chances-are-that-theyll-come-back-for-more/",
    tag: "Ransomware",
  },
  {
    title: "Cyber insurance: Risks and trends 2026",
    source: "Munich Re",
    date: "2026",
    excerpt:
      "Most cyber incidents and claims affect micro-companies and SMEs — yet many still operate without dedicated cyber protection.",
    url: "https://www.munichre.com/en/insights/cyber/cyber-insurance-risks-and-trends-2026.html",
    tag: "SME risk",
  },
  {
    title: "Cyber insurance for small businesses in 2026: MFA, ransomware and premium benchmarks",
    source: "Beancount",
    date: "May 2026",
    excerpt:
      "Insurers now require documented MFA, EDR, and tested backups. Without them, SMEs face denial or premiums up to 300% above average.",
    url: "https://beancount.io/blog/2026/05/09/cyber-insurance-small-business-2026-mfa-requirements-ransomware-coverage-premium-benchmarks",
    tag: "Underwriting",
  },
  {
    title: "Cyber insurance for small business: what it covers, costs, and why you need it",
    source: "InsureShedii",
    date: "2026",
    excerpt:
      "SMEs are targeted in 43% of cyberattacks, yet less than half carry coverage. Average breach costs can reach $100K–$500K without insurance.",
    url: "https://insureshedii.com/cyber-insurance-small-business-2026",
    tag: "Coverage",
  },
  {
    title: "Cyber insurance unpacked: the corporate digital safety net",
    source: "IAIS",
    date: "Jun 2026",
    excerpt:
      "Only a fraction of global cyber losses are insured — with SMEs among the most underinsured commercial customers worldwide.",
    url: "https://www.iais.org/uploads/2026/06/FSI-IAIS-Insights-Cyber-insurance-unpacked-the-corporate-digital-safety-net.pdf",
    tag: "Protection gap",
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothHero = useSpring(scrollYProgress, elasticSpring);
  const heroY = useTransform(smoothHero, [0, 1], [0, 140]);
  const heroScale = useTransform(smoothHero, [0, 1], [1, 0.9]);
  const heroOpacity = useTransform(smoothHero, [0, 0.75, 1], [1, 1, 0.15]);
  const dotsY = useTransform(smoothHero, [0, 1], [0, 40]);

  return (
    <>
      <SEO
        title="Sentrix — Cyber Insurance in Under 5 Minutes"
        description="Protect your business from ransomware, data breaches and cyber extortion. Live risk scoring, instant quotes, real coverage — built for SMEs."
      />
      <Header variant="minimal" />

      <main>
        {/* ── HERO ── */}
        <section ref={heroRef} className="relative min-h-svh overflow-hidden bg-paper">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <motion.div
              style={{ y: dotsY }}
              className="absolute inset-0 z-0 lg:left-[38%] lg:w-[62%]"
            >
              <CyberDotsBackground density="light" className="absolute inset-0 opacity-70" />
            </motion.div>
            <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_30%_40%,rgba(253,251,246,0.35)_0%,rgba(253,251,246,0.72)_42%,rgba(253,251,246,0.94)_68%)] lg:bg-[radial-gradient(circle_at_24%_42%,rgba(253,251,246,0.4)_0%,rgba(253,251,246,0.78)_38%,rgba(253,251,246,0.95)_62%)]" />
            <div className="absolute inset-0 z-[2] bg-gradient-to-r from-paper from-45% via-paper/75 via-60% to-transparent to-85%" />
            <SectionWaveBg className="z-[3]" />
            <div className="absolute -left-24 top-16 z-0 size-80 rounded-full bg-electric/8 blur-3xl" />
            <div className="absolute -right-20 top-32 z-0 size-64 rounded-full bg-gold/10 blur-3xl" />
            <SectionIllustration
              name="connected"
              className="right-[4%] top-[18%] hidden h-40 w-40 text-cyan/30 lg:block"
              accentClassName="text-cyan"
              opacity={0.35}
            />
          </div>
          <div className="relative z-10 flex min-h-svh items-center pt-[72px] pb-10 lg:pt-20 lg:pb-12">
            <Container>
              <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 xl:gap-10">
                <motion.div
                  style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
                  className="mx-auto flex w-full max-w-3xl origin-center flex-col items-center justify-center gap-7 will-change-transform sm:gap-8 lg:mx-0 lg:max-w-none lg:items-start lg:text-left"
                >
                  {/* <div className="mt-3 flex flex-col items-center justify-center gap-2.5 lg:items-start">
                    <div className="inline-flex items-center justify-center gap-2">
                      <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        Live underwriting engine · Backed by
                      </span>
                    </div>
                    <img
                      src="/logos/munich-re.png"
                      alt="Munich Re"
                      className="h-4 w-auto object-contain opacity-90"
                    />
                  </div> */}

                  <h1 className="display-xl lg:text-left">
                    <span className="block lg:whitespace-nowrap">Protect your business</span>
                    <span className="block lg:whitespace-nowrap">from cyber attacks.</span>
                  </h1>

                  <div className="max-w-xl space-y-2 body-lg lg:text-left">
                    <p className="flex items-center justify-center gap-1.5 lg:justify-start">
                      <span className="animate-flag-wave inline-flex shrink-0 align-middle">
                        <svg
                          viewBox="0 0 24 16"
                          className="h-3.5 w-[21px] rounded-[2px] shadow-sm ring-1 ring-black/10"
                          aria-hidden
                        >
                          <rect width="6" height="16" fill="#FF0000" />
                          <rect x="6" width="18" height="5.333" fill="#00732F" />
                          <rect x="6" y="5.333" width="18" height="5.334" fill="#FFFFFF" />
                          <rect x="6" y="10.667" width="18" height="5.333" fill="#000000" />
                        </svg>
                      </span>
                      UAE&apos;s first Cyber Insurance for SMEs.
                    </p>
                    <p className="flex items-center justify-center gap-2 lg:justify-start">
                      <span className="size-1.5 shrink-0 rounded-full bg-electric" aria-hidden />
                      Get insured in under 5 minutes.
                    </p>
                    <p className="flex items-center justify-center gap-2 lg:justify-start">
                      <span className="size-1.5 shrink-0 rounded-full bg-electric" aria-hidden />
                      Live risk scoring, instant quotes, real coverage.
                    </p>
                  </div>

                  <TrustBadges items={certifications} className="!mt-0 lg:justify-start" />

                  <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                    <Button asChild variant="default" shape="pill" size="lg">
                      <Link to="/quote">
                        Get my quote
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <a
                      href="#how"
                      className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      How it works
                      <span className="block h-px w-8 bg-border transition-all group-hover:w-12 group-hover:bg-foreground" />
                    </a>
                  </div>

                  <div className="relative mx-auto mt-2 w-full max-w-sm lg:hidden">
                    <UndrawIllustration
                      name="secure-server"
                      title="Cyber security for your business"
                      className="h-44 w-full opacity-95"
                    />
                  </div>
                </motion.div>

                <motion.div
                  style={{ y: heroY, opacity: heroOpacity }}
                  className="relative mx-auto hidden aspect-[5/4] w-full max-w-xl lg:block"
                  aria-hidden
                >
                  <UndrawIllustration
                    name="connected-world"
                    accentClassName="text-cyan"
                    className="absolute -left-4 top-2 h-[68%] w-[68%] animate-float-soft-delayed opacity-50"
                  />
                  <UndrawIllustration
                    name="secure-server"
                    title="Secure servers and business data"
                    className="relative z-10 h-full w-full animate-float-soft drop-shadow-[0_24px_48px_rgba(25,118,255,0.12)]"
                  />
                  <UndrawIllustration
                    name="firewall"
                    accentClassName="text-gold"
                    className="absolute -bottom-2 -right-1 z-20 h-[36%] w-[36%] animate-float-soft-delayed opacity-80"
                  />
                </motion.div>
              </div>
            </Container>
          </div>
        </section>

        {/* ── STATS: visual cards ── */}
        <ScrollElasticSection className="relative overflow-hidden border-b border-border bg-navy-deep text-white">
          <SectionIllustration
            name="hacker-mindset"
            className="-right-10 top-6 z-0 hidden h-80 w-80 text-cyan md:block"
            accentClassName="text-cyan"
            opacity={0.07}
          />
          <SectionIllustration
            name="firewall"
            className="-left-16 bottom-0 z-0 hidden h-72 w-72 text-electric sm:block"
            opacity={0.08}
          />
          <Container className="relative z-10 section-pad">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">
                The cyber risk landscape
              </p>
              <h2 className="display-lg mt-4 text-white">Why SMEs need cover now</h2>
              <p className="mt-4 text-base text-white/55">
                UAE networks block up to{" "}
                <span className="font-semibold text-accent">200,000 attacks daily</span> — yet most
                SMEs remain uninsured against breach and ransomware costs.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...revealSpring, delay: i * 0.06 }}
                  className={`group relative z-10 overflow-hidden rounded-2xl border p-5 transition-transform hover:-translate-y-1 sm:p-6 ${
                    stat.highlight
                      ? "border-accent/40 bg-gradient-to-br from-accent/20 via-white/10 to-electric/10 shadow-[0_0_40px_rgba(200,240,96,0.15)]"
                      : "border-white/10 bg-[#102950]/95 hover:border-white/20 hover:bg-[#102950]"
                  }`}
                >
                  <div
                    className="mb-4 flex size-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: stat.bg, color: stat.accent }}
                  >
                    <stat.icon className="size-4" strokeWidth={1.75} aria-hidden />
                  </div>
                  <p className="text-[10px] font-semibold uppercase leading-snug tracking-[0.12em] text-white/45">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-display text-[1.75rem] font-light leading-none tabular-nums text-white lg:text-[2rem]">
                    {stat.value}
                    {stat.unit && <span className="text-base text-white/50">{stat.unit}</span>}
                  </p>
                  <p className="mt-2.5 text-[11px] leading-relaxed text-white/50">{stat.detail}</p>
                  {stat.highlight && (
                    <div
                      className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-accent/10 blur-2xl"
                      aria-hidden
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </Container>
        </ScrollElasticSection>

        <CyberArticlesScroll articles={cyberArticles} />

        {/* ── HOW IT WORKS ── */}
        <ScrollElasticSection id="how" className="section-pad bg-[#e8f2ff]">
          <SectionIllustration
            name="data-at-work"
            className="-right-12 top-12 hidden h-96 w-96 text-electric/80 lg:block"
            opacity={0.1}
          />
          <SectionIllustration
            name="server-cluster"
            className="-left-16 bottom-8 hidden h-72 w-72 text-navy-deep/60 md:block"
            opacity={0.08}
          />
          <Container className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="label-caps text-electric">How it works</p>
              <h2 className="display-lg mt-4">Three steps to get fully insured</h2>
            </div>

            <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3 sm:gap-5">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ ...revealSpring, delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="relative flex flex-col overflow-hidden rounded-2xl border border-white/90 bg-white p-6 text-center shadow-[0_12px_32px_rgba(6,26,64,0.1),inset_0_1px_0_rgba(255,255,255,0.95)] transition-shadow duration-300 hover:shadow-[0_20px_44px_rgba(6,26,64,0.16),inset_0_1px_0_rgba(255,255,255,1)] sm:p-8"
                >
                  <span
                    className="pointer-events-none absolute -right-10 -top-14 size-36 rounded-full blur-2xl"
                    style={{ backgroundColor: stepColors[i], opacity: 0.18 }}
                    aria-hidden
                  />
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white via-white/55 to-transparent" aria-hidden />
                  <div
                    className="relative mx-auto flex size-12 items-center justify-center rounded-xl text-white font-display text-sm font-semibold shadow-[0_8px_18px_rgba(6,26,64,0.18)]"
                    style={{ backgroundColor: stepColors[i] }}
                  >
                    {step.num}
                  </div>
                  <step.icon
                    className="mx-auto mt-5 size-5"
                    style={{ color: stepColors[i] }}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <h3 className="mt-4 font-display text-xl font-normal">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  <UndrawIllustration
                    name={stepIllustrations[i]}
                    className="mx-auto mt-5 h-28 w-full max-w-[160px] opacity-90"
                    accentClassName="text-electric"
                  />
                </motion.div>
              ))}
            </div>
          </Container>
        </ScrollElasticSection>

        {/* ── COVERAGE: alternating rows ── */}
        <ScrollElasticSection
          id="coverage"
          className="section-pad bg-paper"
          backgroundDecoration={<SectionWaveBg />}
        >
          <SectionIllustration
            name="server-cluster"
            className="right-0 top-16 hidden h-[28rem] w-[28rem] text-electric lg:block"
            opacity={0.06}
          />
          <Container className="relative">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <p className="label-caps">Coverage highlights</p>
              <h2 className="display-lg mt-4">Insurance that actually pays out.</h2>
              <p className="mt-4 body-lg !text-base">
                Every policy includes 24/7 incident response, forensics, legal support and
                ransomware negotiation. No small print games.
              </p>
              <Button asChild variant="outline" shape="pill" className="mt-8">
                <Link to="/plans">
                  Explore plans
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mx-auto flex max-w-4xl flex-col gap-4 lg:gap-5">
              {coverageItems.map((item, i) => (
                <CoverageRow key={item.title} item={item} index={i} />
              ))}
            </div>
          </Container>
        </ScrollElasticSection>

        {/* ── INDUSTRIES ── */}
        <ScrollElasticSection className="relative overflow-hidden section-pad bg-navy-deep text-white">
          <SectionIllustration
            name="connected-world"
            className="left-1/2 top-8 hidden h-96 w-96 -translate-x-1/2 text-cyan lg:block"
            accentClassName="text-cyan"
            opacity={0.06}
          />
          <Container className="relative text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">
              Built for your industry
            </p>
            <h2 className="display-lg mx-auto mt-4 max-w-lg text-white">
              Tailored for the way you operate
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/55">
              Explore the typical risks, claims examples and average premiums for your sector.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {industries.map((ind, i) => (
                <motion.button
                  key={ind.name}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...revealSpring, delay: i * 0.04 }}
                  className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-2xl bg-white/10 p-5 text-left transition-all hover:-translate-y-1 sm:min-h-[180px] sm:p-6"
                >
                  <img
                    src={ind.image}
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-65 transition duration-500 group-hover:scale-105 group-hover:opacity-80"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/60 to-navy-deep/15" aria-hidden />
                  <div
                    className="relative flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: industryColors[i] }}
                  >
                    <ind.icon className="size-5 text-white" strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className="relative mt-6">
                    <p className="font-display text-lg leading-snug text-white">{ind.name}</p>
                    <p className="mt-2 text-xs leading-relaxed text-white/70 transition-all duration-300 max-sm:line-clamp-none sm:mt-0 sm:max-h-0 sm:overflow-hidden sm:opacity-0 sm:group-hover:mt-2 sm:group-hover:max-h-none sm:group-hover:overflow-visible sm:group-hover:opacity-100">
                      {ind.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </Container>
        </ScrollElasticSection>

        {/* ── FAQ: split layout ── */}
        <ScrollElasticSection
          id="faq"
          className="relative overflow-hidden section-pad bg-navy-deep text-white"
        >
          <SectionIllustration
            name="secure-login"
            className="-left-10 bottom-0 hidden h-80 w-80 text-electric md:block"
            opacity={0.07}
          />
          <Container className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">
                Frequently asked
              </p>
              <h2 className="display-lg mt-4 text-white">Answers, before you ask</h2>
            </div>
            <Accordion
              type="single"
              collapsible
              className="mx-auto mt-14 max-w-2xl rounded-2xl border border-border bg-white px-6 py-3 text-navy-deep shadow-soft sm:mt-16 sm:px-8 sm:py-4 lg:px-10 lg:py-5"
            >
              {faqs.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q} className="border-border last:border-b-0">
                  <AccordionTrigger className="py-7 font-display text-lg font-normal text-navy-deep hover:no-underline sm:py-8">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pr-2 text-ink-muted sm:pr-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Container>
        </ScrollElasticSection>
      </main>

      <Footer />
    </>
  );
}
