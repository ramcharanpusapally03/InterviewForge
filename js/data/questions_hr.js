// HR, Behavioral, and Everyday Workplace Scenarios with STAR Framework Rubrics
export const HR_QUESTIONS = [
  // --- EVERYDAY WORKPLACE & AGILE SCENARIOS ---
  {
    id: 'hr_daily_01',
    category: 'Workplace & Daily Routine',
    topic: 'Daily Standups & Task Prioritization',
    companyTags: ['frontend_track', 'data_analyst_track', 'cyber_track', 'product_sde1', 'accenture_ase', 'tcs_nqt'],
    question: 'How do you structure your daily workday as an engineer, and how do you give a crisp, effective update in a daily agile standup?',
    whatInterviewerLooksFor: 'Self-discipline, time-management, familiarity with Agile/Scrum rituals, ability to communicate blockers proactively without rambling.',
    starGuide: {
      framework: 'Yesterday -> Today -> Blockers',
      steps: [
        'Mention keeping updates under 90 seconds.',
        'State what you completed yesterday (business impact / ticket number).',
        'State your primary focus for today.',
        'State any blockers or dependencies on other teams transparently.'
      ]
    },
    sampleGoodAnswer: '"I begin each day by reviewing our sprint board and prioritizing tasks using time-blocking. In our daily 15-minute standup, I keep my update crisp and focused on team momentum: 1) What I finished yesterday (e.g. completed the checkout form validation and merged PR #42), 2) What I am delivering today (writing unit tests and integrating the payment webhook), and 3) Any blockers (e.g. waiting for API keys from DevOps). If an issue needs deep discussion, I suggest taking it offline to a separate sync so we respect everyone\'s time."',
    trapsToAvoid: [
      'Do not give a minute-by-minute diary of your day.',
      'Do not hide blockers until deadlines are missed; mention dependencies early.'
    ]
  },
  {
    id: 'hr_daily_02',
    category: 'Workplace & Daily Routine',
    topic: 'Handling Urgent Incidents & Pressure',
    companyTags: ['frontend_track', 'data_analyst_track', 'cyber_track', 'product_sde1', 'tcs_nqt', 'infosys_sp'],
    question: 'A critical bug is discovered in production right as you are wrapping up your day. Walk me through how you react, communicate, and triage the situation.',
    whatInterviewerLooksFor: 'Composure under pressure, ownership mentality, adherence to incident protocol (containment -> triage -> communication -> fix -> post-mortem).',
    starGuide: {
      situation: 'Critical regression or production alert triggered late in the day.',
      task: 'Assess severity, notify stakeholders, and stabilize the system before logging off.',
      action: 'Check error logs/metrics, determine blast radius, rollback if necessary, or push a hotfix, keeping the team lead updated.',
      result: 'System stabilized, client impact minimized, and a follow-up root-cause post-mortem scheduled.'
    },
    sampleGoodAnswer: '"First, I stay calm and assess the severity—how many users are impacted and is data corrupted? I immediately notify my team lead or post in our incident channel so everyone is aligned. Next, I look at the recent deployment diff and server logs. If it is a critical blocker, rolling back to the previous stable release is often the safest immediate action to protect users while we investigate. Once the service is restored, I write down the root cause and add regression tests the next morning so the issue never re-occurs."',
    trapsToAvoid: [
      'Never say "I would just leave it for tomorrow morning if my shift is over".',
      'Never deploy an untested midnight quick-patch directly to production without code review or rollback plans.'
    ]
  },
  {
    id: 'hr_daily_03',
    category: 'Communication & Stakeholders',
    topic: 'Explaining Tech to Non-Tech Audiences',
    companyTags: ['data_analyst_track', 'frontend_track', 'product_sde1', 'accenture_ase', 'wipro_turbo'],
    question: 'How do you explain a complex technical bug or system delay to a non-technical product manager, client, or business stakeholder?',
    whatInterviewerLooksFor: 'Empathy, clarity of thought, avoiding obscure acronyms, translating technical details into business impact and actionable next steps.',
    starGuide: {
      framework: 'Impact -> Analogy / High-Level Reason -> Concrete Timeline & Solution',
      steps: [
        'Acknowledge the business impact first (e.g. user experience, revenue, timeline).',
        'Use simple real-world analogies rather than obscure code jargon.',
        'Present the clear solution options and estimated delivery time.'
      ]
    },
    sampleGoodAnswer: '"I focus on business outcomes rather than internal code mechanics. Instead of saying \'our Redis connection pool timed out during high thread contention\', I explain: \'The temporary login slowdown happened because our server was overwhelmed by simultaneous requests, similar to too many cars trying to pass through a single toll booth. We have added extra lanes (horizontal scaling) to absorb traffic immediately, and we are caching user sessions so returning users pass through instantly. The fix is live, and we have set up automated alarms.\'"',
    trapsToAvoid: [
      'Do not overwhelm them with deep database jargon or blame other engineers.',
      'Always offer a solution and a reliable timeline.'
    ]
  },
  {
    id: 'hr_daily_04',
    category: 'Rapid Learning',
    topic: 'Learning Under Deadlines',
    companyTags: ['frontend_track', 'product_sde1', 'tcs_nqt', 'infosys_sp', 'accenture_ase'],
    question: 'Tell me about a time you were assigned to use an unfamiliar framework, library, or API that you had never touched before. How did you get up to speed quickly?',
    whatInterviewerLooksFor: 'Resourcefulness, quick-learning aptitude, systematic approach (official docs -> minimal sandbox prototype -> production integration).',
    starGuide: {
      situation: 'Needed to implement a feature with a completely new library/technology.',
      task: 'Master the core concepts and deliver the feature reliably within days.',
      action: 'Read official documentation, inspected boilerplate repos, built a mini proof-of-concept sandbox before writing production code.',
      result: 'Delivered the feature on schedule with clean, documented code.'
    },
    sampleGoodAnswer: '"During a recent hackathon, our team needed to integrate WebSockets for live notifications, which I had never implemented from scratch. Instead of getting stuck reading endless tutorials, I went straight to the official documentation and built a minimal 20-line Node.js ping-pong server in an isolated sandbox. Once I understood the handshake and event emitter patterns, I scaled it into our main codebase, wrote error-handling reconnect logic, and delivered the notification system 6 hours ahead of the demo deadline."',
    trapsToAvoid: [
      'Do not say "I just copied code from StackOverflow or ChatGPT without understanding how it works".',
      'Emphasize understanding the foundational concepts and testing edge cases.'
    ]
  },

  // --- STANDARD HR & FIT ---
  {
    id: 'hr_01',
    category: 'Elevator Pitch',
    topic: 'Introduction & Background',
    companyTags: ['tcs_nqt', 'infosys_sp', 'wipro_turbo', 'accenture_ase', 'product_sde1', 'frontend_track', 'data_analyst_track', 'cyber_track'],
    question: 'Tell me about yourself and walk me through your journey, skills, and why you are excited for this role.',
    whatInterviewerLooksFor: 'Clear articulation, structured narrative (Present -> Past -> Future), technical passion, and relevant project highlights without reciting resume verbatim.',
    starGuide: {
      framework: 'Present -> Past -> Future',
      steps: [
        'Present: Current degree/background, core skills, and primary domain focus.',
        'Past: 1-2 major hands-on projects or practical experiences and key technologies mastered.',
        'Future: Why you are excited to contribute your energy to this specific position and company.'
      ]
    },
    sampleGoodAnswer: '"Hello, my name is [Name], and I am a software developer with a strong foundation in core computer science, Data Structures, and modern web engineering. Over the past few years, I have built and deployed practical applications: for example, I engineered an end-to-end full-stack platform that solved real user workflows, handled authentication, and integrated responsive data views. Beyond code, I enjoy breaking down complex problems and collaborating with team members. I am looking forward to this opportunity because of your engineering excellence and the chance to contribute to impactful systems."',
    trapsToAvoid: [
      'Do not recite marks from high school or read your resume line by line.',
      'Keep your introduction between 90 to 120 seconds with high energy.'
    ]
  },
  {
    id: 'hr_02',
    category: 'Behavioral & Conflict',
    topic: 'Teamwork & Conflict Resolution',
    companyTags: ['tcs_nqt', 'infosys_sp', 'accenture_ase', 'product_sde1', 'frontend_track', 'data_analyst_track'],
    question: 'Describe a situation during a project where you had a strong disagreement with a teammate or colleague. How did you handle it and what was the outcome?',
    whatInterviewerLooksFor: 'Emotional maturity, active listening, ability to prioritize project goals over personal ego, and constructive communication.',
    starGuide: {
      situation: 'Describe the team, the project goal, and the origin of the disagreement.',
      task: 'Your responsibility to ensure project deadlines were met while preserving team unity.',
      action: 'Steps taken to address the conflict objectively (e.g., benchmarked alternatives, created a pros/cons matrix, held a calm 1-on-1).',
      result: 'The outcome of the decision, how it impacted the project, and the enduring team relationship.'
    },
    sampleGoodAnswer: '"During a collaborative project, my teammate and I disagreed on whether to use MongoDB or PostgreSQL for user authentication and transaction records. My teammate preferred MongoDB for speed of initial setup, while I advocated for PostgreSQL because of ACID compliance for transactions. Instead of arguing, I proposed building a quick 30-minute prototype schema comparison and listing our requirements. We realized that our financial ledger needed strict foreign key guarantees. Seeing the matrix, my teammate agreed, and we successfully delivered the module 3 days ahead of the presentation."',
    trapsToAvoid: [
      'Never blame or disparage the other person.',
      'Avoid saying "I never have disagreements with anyone" (unrealistic).',
      'Ensure the story ends with a positive, collaborative resolution.'
    ]
  },
  {
    id: 'hr_04',
    category: 'Self-Awareness',
    topic: 'Weaknesses & Continuous Learning',
    companyTags: ['tcs_nqt', 'infosys_sp', 'wipro_turbo', 'accenture_ase', 'product_sde1', 'frontend_track', 'cyber_track'],
    question: 'What is your greatest professional weakness, and what steps are you actively taking to overcome it?',
    whatInterviewerLooksFor: 'Self-awareness, honesty, and a demonstrable action plan for self-improvement rather than fake humility.',
    starGuide: {
      framework: 'Real Minor Weakness -> Realization -> Corrective Action -> Measurable Progress',
      steps: [
        'Select a genuine professional skill (e.g., public speaking, over-engineering initial prototypes, hesitation in delegating).',
        'State how you noticed it.',
        'Detail the habits or tools you adopted to improve.',
        'Conclude with how it is already improving.'
      ]
    },
    sampleGoodAnswer: '"Earlier in my projects, I tended to over-commit and had difficulty saying no when peer groups requested help, which occasionally squeezed my own deadlines. I realized that time management requires clear prioritization. Over the past year, I adopted time-blocking using Google Calendar and started evaluating tasks by urgency and importance. Now, I communicate my availability transparently and set realistic turnaround times, which has made me much more consistent in hitting deadlines."',
    trapsToAvoid: [
      'Never give cliché answers like "I am a perfectionist" or "I work too hard".',
      'Never state core red flags like "I miss deadlines" or "I get angry under pressure".'
    ]
  }
];
