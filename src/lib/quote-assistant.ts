export type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

type StepContext = {
  id: string
  title: string
  subtitle?: string
  tip?: string
}

const STEP_HINTS: Record<string, { intro: string; suggestions: string[] }> = {
  industry: {
    intro: "Welcome — let's build your cyber shield. This is a friendly 2-minute check and your score updates live. Pick the industry closest to your business to get started.",
    suggestions: ['How long does this take?', 'What affects my premium?', 'Why does industry matter?'],
  },
  revenue: {
    intro: 'Revenue helps size your coverage limit. Slide to your approximate annual figure — exact numbers aren\'t required.',
    suggestions: ['How is revenue used?', 'What if revenue varies?', 'Does revenue affect my score?'],
  },
  employees: {
    intro: 'Headcount reflects exposure — more people usually means more devices, accounts, and phishing targets.',
    suggestions: ['Do contractors count?', 'Remote vs office staff?', 'How does this affect premium?'],
  },
  cloudServices: {
    intro: 'Cloud email, file storage, and business apps expand your attack surface — but also enable stronger security when configured well.',
    suggestions: ['Microsoft 365 counts?', 'Is cloud safer?', 'Does this affect my score?'],
  },
  operates: {
    intro: 'Work setup affects risk — remote and hybrid teams often need extra controls like MFA and VPN.',
    suggestions: ['Remote-only risks?', 'Hybrid best practices', 'Does this change my score?'],
  },
  data: {
    intro: 'Select every type of sensitive data you store. More categories can mean higher exposure, but honest answers get you accurate coverage.',
    suggestions: ['What counts as sensitive?', 'Can I select multiple?', 'What if we store none?'],
  },
  payments: {
    intro: 'Processing payments online increases fraud and PCI-related exposure. Be honest — it helps us right-size your policy.',
    suggestions: ['PCI compliance help?', 'Third-party processors?', 'Payment fraud coverage'],
  },
  securityAwareness: {
    intro: 'Annual security training plus simulated phishing tests are among the strongest risk signals — they show your team can spot social engineering.',
    suggestions: ['What training counts?', 'Recommended phishing tools?', 'How much does this save?'],
  },
  secureAccess: {
    intro: 'MFA and VPN together protect accounts and remote traffic. MFA blocks over 99% of automated attacks; VPN keeps remote access inside your security perimeter.',
    suggestions: ['What is MFA?', 'VPN vs zero trust?', 'How to roll out both?'],
  },
  assetPatch: {
    intro: 'An up-to-date asset inventory plus timely patching closes known gaps before attackers exploit them.',
    suggestions: ['What to include in inventory?', 'Patch management tools', 'Auto-updates enough?'],
  },
  endpointControls: {
    intro: 'Unrestricted software installs and unsupported legacy systems are common ransomware entry points. Controlled installs and modern software reduce risk.',
    suggestions: ['App allowlisting?', 'Legacy replacement planning', 'Developer exceptions'],
  },
  backupRecovery: {
    intro: 'Regular backups plus tested restores are your lifeline after ransomware. Untested backups fail when you need them most.',
    suggestions: ['3-2-1 backup rule', 'How to test restores?', 'Recovery time targets'],
  },
  emailSecurity: {
    intro: 'Email filtering and domain authentication (SPF, DKIM, DMARC) stop malicious mail and domain impersonation before they reach your team.',
    suggestions: ['What is DMARC?', 'Microsoft vs Google setup', 'Phishing still gets through?'],
  },
  endpointProtection: {
    intro: 'Antivirus on every device plus centralised monitoring catches malware and intrusions that email filters miss.',
    suggestions: ['EDR vs antivirus', 'SIEM for SMEs?', 'Managed SOC options'],
  },
  incidentResponse: {
    intro: 'A documented incident response plan — reviewed annually — tells your team exactly what to do when something happens.',
    suggestions: ['Plan template', 'Tabletop exercises', 'Insurance notification steps'],
  },
  loading: {
    intro: "Almost there — I'm running your answers through our underwriting engine now.",
    suggestions: ['What happens next?', 'Can I change answers?', 'When do I get documents?'],
  },
}

const FAQ_RESPONSES: { match: RegExp; reply: string }[] = [
  { match: /how long|minutes|time|duration/i, reply: 'Most businesses finish in under five minutes. You can pause anytime — your progress is saved in this session.' },
  { match: /secure|privacy|data|encrypt|sell/i, reply: "All submissions are encrypted end-to-end. We're SOC 2 and ISO 27001 aligned, and we never sell your data." },
  { match: /premium|price|cost|expensive|cheap/i, reply: 'Premium depends on revenue, headcount, industry, and your security score. Better controls = lower price. Watch the live estimate in the left panel.' },
  { match: /score|grade|rating/i, reply: 'Your cyber score (0–100) updates live as you answer. Training, MFA, backups and patching have the biggest impact.' },
  { match: /mfa|two.?factor|2fa|authenticator/i, reply: 'MFA means logging in with a password plus a code from your phone or authenticator app. It blocks over 99% of automated attacks.' },
  { match: /not sure|don't know|unsure|help me choose/i, reply: 'Select "Not sure" on any question — we\'ll use conservative underwriting defaults. You can also ask me about the specific question you\'re on.' },
  { match: /country|canada|international|cover/i, reply: 'We cover businesses across Canada and select international markets. More geographies are being added regularly.' },
  { match: /lower|reduce|discount|improve/i, reply: 'Complete security upgrades after purchase — MFA, backups, training — to unlock instant premium discounts on renewal.' },
  { match: /plan|basic|value|premium|coverage/i, reply: "After this check you'll compare Basic, Value and Premium plans with adjustable policy limits. Value is our most popular tier." },
  { match: /ransomware|breach|attack|incident/i, reply: 'Every Sentrix policy includes 24/7 incident response, forensics, legal support and ransomware negotiation.' },
  { match: /hello|hi|hey|start/i, reply: "Hello! I'm here to help you through the cyber health check. Ask about the current question or anything about coverage." },
]

export function getStepContext(step: StepContext) {
  return STEP_HINTS[step.id] ?? {
    intro: `You're on: "${step.title}". Ask me if anything is unclear.`,
    suggestions: ['Explain this question', 'What should I pick?', 'Does this affect my score?'],
  }
}

export function generateAssistantReply(input: string, step: StepContext): string {
  const lower = input.toLowerCase()

  for (const { match, reply } of FAQ_RESPONSES) {
    if (match.test(lower)) return reply
  }

  if (/explain|what (is|does|mean)|help|current|this question/i.test(lower)) {
    const hint = STEP_HINTS[step.id]
    if (hint) return hint.intro
    return step.subtitle ?? `"${step.title}" — answer based on your current setup. Honest answers give you accurate coverage.`
  }

  if (/tip|advice|best practice|recommend/i.test(lower) && step.tip) {
    return step.tip
  }

  if (/pick|choose|select|should i/i.test(lower)) {
    return "Answer based on how things work today — not how you plan them to be. If you're genuinely unsure, choose \"Not sure\" and we'll apply safe defaults."
  }

  return `Good question. For "${step.title}": ${STEP_HINTS[step.id]?.intro ?? step.subtitle ?? 'Take your best guess — you can improve your score and premium later with security upgrades.'}`
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
