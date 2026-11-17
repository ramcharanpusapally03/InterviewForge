// Practice Tracks: Role-Based Career Paths & Campus Recruitment Drives
export const COMPANY_TRACKS = [
  // --- ROLE-BASED PRACTICE TRACKS (FOR ANY CANDIDATE / JOB SEEKER) ---
  {
    id: 'frontend_track',
    name: 'Frontend Developer (React / UI / Web)',
    category: 'Job Role Track',
    logo: 'fa-brands fa-react',
    badgeColor: '#06b6d4',
    targetRoles: ['Junior Frontend Engineer', 'React Developer', 'UI Engineer'],
    description: 'Master HTML/CSS layout, JavaScript fundamentals, React component lifecycles, and modern web performance.',
    rounds: [
      { id: 'round_1', name: 'Round 1: Problem Solving & Logic', type: 'aptitude', count: 8, durationMin: 12, cutoff: 65 },
      { id: 'round_2', name: 'Round 2: Modern JavaScript & React MCQs', type: 'technical', count: 10, durationMin: 15, cutoff: 70 },
      { id: 'round_3', name: 'Round 3: Frontend Architecture & UI Viva', type: 'viva', count: 5, durationMin: 10, cutoff: 75 },
      { id: 'round_4', name: 'Round 4: Cross-functional Collaboration & HR', type: 'hr', count: 5, durationMin: 10, cutoff: 75 }
    ],
    tips: [
      'Focus on state management, hooks (useEffect, useMemo), virtual DOM reconciliation, and CSS Flexbox/Grid.',
      'Be ready to explain how to optimize Largest Contentful Paint (LCP) and avoid unnecessary re-renders.'
    ]
  },
  {
    id: 'data_analyst_track',
    name: 'Data Analyst & Business Intelligence',
    category: 'Job Role Track',
    logo: 'fa-solid fa-chart-pie',
    badgeColor: '#10b981',
    targetRoles: ['Data Analyst', 'BI Developer', 'Product Analyst'],
    description: 'Prepare for data roles testing SQL queries, data wrangling, metrics modeling, and statistical decision-making.',
    rounds: [
      { id: 'round_1', name: 'Round 1: Quantitative Aptitude & Statistics', type: 'aptitude', count: 10, durationMin: 15, cutoff: 70 },
      { id: 'round_2', name: 'Round 2: Advanced SQL & Data Wrangling', type: 'technical', count: 10, durationMin: 15, cutoff: 70 },
      { id: 'round_3', name: 'Round 3: Data Project Defense & Metrics Viva', type: 'viva', count: 5, durationMin: 10, cutoff: 75 },
      { id: 'round_4', name: 'Round 4: Business Stakeholder & Behavioral', type: 'hr', count: 5, durationMin: 10, cutoff: 75 }
    ],
    tips: [
      'Master SQL window functions (ROW_NUMBER, RANK, DENSE_RANK), joins, aggregations, and subqueries.',
      'Practice explaining complex analytical findings in simple business terms to non-technical stakeholders.'
    ]
  },
  {
    id: 'cyber_track',
    name: 'Cybersecurity Analyst & AppSec',
    category: 'Job Role Track',
    logo: 'fa-solid fa-shield-halved',
    badgeColor: '#e11d48',
    targetRoles: ['SOC Analyst', 'Junior Security Engineer', 'AppSec Trainee'],
    description: 'Assess network fundamentals, encryption, vulnerability triage, authentication, and the OWASP Top 10.',
    rounds: [
      { id: 'round_1', name: 'Round 1: Analytical Logic & Problem Solving', type: 'aptitude', count: 8, durationMin: 12, cutoff: 65 },
      { id: 'round_2', name: 'Round 2: Networks, OWASP & Security MCQs', type: 'technical', count: 10, durationMin: 15, cutoff: 70 },
      { id: 'round_3', name: 'Round 3: Threat Modeling & Security Viva', type: 'viva', count: 5, durationMin: 10, cutoff: 75 },
      { id: 'round_4', name: 'Round 4: Incident Handling & Behavioral', type: 'hr', count: 5, durationMin: 10, cutoff: 75 }
    ],
    tips: [
      'Know the differences between XSS, CSRF, and SQL Injection mitigations by heart.',
      'Understand symmetric vs asymmetric key encryption, hashing salts, and zero-trust principles.'
    ]
  },
  {
    id: 'product_sde1',
    name: 'Software Developer (SDE-1 / Full Stack)',
    category: 'Product & Tech',
    logo: 'fa-solid fa-code',
    badgeColor: '#ea580c',
    targetRoles: ['Full Stack Developer', 'Software Engineer (SDE-1)', 'Backend Developer'],
    description: 'High-bar engineering interviews focusing on Data Structures, algorithms, system basics, and clean code.',
    rounds: [
      { id: 'round_1', name: 'Round 1: Quantitative Logic & Puzzles', type: 'aptitude', count: 8, durationMin: 15, cutoff: 70 },
      { id: 'round_2', name: 'Round 2: DSA & Core CS Deep Dive', type: 'technical', count: 10, durationMin: 20, cutoff: 75 },
      { id: 'round_3', name: 'Round 3: In-Depth Project Viva & Scalability', type: 'viva', count: 5, durationMin: 15, cutoff: 75 },
      { id: 'round_4', name: 'Round 4: Behavioral & Engineering Principles', type: 'hr', count: 5, durationMin: 10, cutoff: 80 }
    ],
    tips: [
      'Always discuss time and space complexity ($O(n)$, $O(\\log n)$) without being prompted.',
      'Be prepared to justify database indexing, caching strategies, and concurrency handling in your projects.'
    ]
  },

  // --- CAMPUS PLACEMENT DRIVES ---
  {
    id: 'tcs_nqt',
    name: 'TCS NQT (National Qualifier Test)',
    category: 'Campus Drive',
    logo: 'fa-solid fa-building-columns',
    badgeColor: '#2563eb',
    targetRoles: ['Ninja (3.36 LPA)', 'Digital (7-7.5 LPA)', 'Prime (9-11 LPA)'],
    description: 'National campus recruitment test evaluating cognitive aptitude and foundational technical coding.',
    rounds: [
      { id: 'round_1', name: 'Round 1: Cognitive Aptitude', type: 'aptitude', count: 10, durationMin: 15, cutoff: 70 },
      { id: 'round_2', name: 'Round 2: Technical & Pseudocode', type: 'technical', count: 10, durationMin: 15, cutoff: 70 },
      { id: 'round_3', name: 'Round 3: Technical Viva & Core CS', type: 'viva', count: 5, durationMin: 10, cutoff: 75 },
      { id: 'round_4', name: 'Round 4: Managerial & HR', type: 'hr', count: 5, durationMin: 10, cutoff: 80 }
    ],
    tips: [
      'Numerical ability focuses heavily on Percentages, Work-Time, and Elementary Statistics.',
      'Pseudocode questions test C/C++ bitwise operators, loops, and recursive calls.'
    ]
  },
  {
    id: 'infosys_sp',
    name: 'Infosys (Specialist Programmer & DSE)',
    category: 'Campus Drive',
    logo: 'fa-solid fa-laptop-code',
    badgeColor: '#0284c7',
    targetRoles: ['Systems Engineer (3.6 LPA)', 'DSE (6.25 LPA)', 'Specialist Programmer (9.5 LPA)'],
    description: 'Renowned for rigorous pseudocode, logical reasoning, and algorithmic problem solving.',
    rounds: [
      { id: 'round_1', name: 'Round 1: Reasoning & Mathematical Ability', type: 'aptitude', count: 10, durationMin: 15, cutoff: 65 },
      { id: 'round_2', name: 'Round 2: Pseudocode & DBMS Queries', type: 'technical', count: 10, durationMin: 15, cutoff: 70 },
      { id: 'round_3', name: 'Round 3: OOPs & Project Viva', type: 'viva', count: 5, durationMin: 10, cutoff: 75 },
      { id: 'round_4', name: 'Round 4: Behavioral & HR Fit', type: 'hr', count: 5, durationMin: 10, cutoff: 75 }
    ],
    tips: [
      'Pseudocode section tests recursive stack tracing and edge case values.',
      'DBMS questions focus on SQL joins, GROUP BY/HAVING clauses, and normalization anomalies.'
    ]
  },
  {
    id: 'accenture_ase',
    name: 'Accenture (ASE & FSE)',
    category: 'Campus Drive',
    logo: 'fa-solid fa-network-wired',
    badgeColor: '#7c3aed',
    targetRoles: ['Associate Software Engineer (4.5 LPA)', 'Full Stack Engineer (6.5 LPA)'],
    description: 'Cognitive and technical assessment followed by a critical thinking test and virtual interview.',
    rounds: [
      { id: 'round_1', name: 'Round 1: Cognitive & Analytical Ability', type: 'aptitude', count: 10, durationMin: 15, cutoff: 70 },
      { id: 'round_2', name: 'Round 2: Cloud, Security & Common Apps', type: 'technical', count: 10, durationMin: 15, cutoff: 70 },
      { id: 'round_3', name: 'Round 3: Technical Viva & Problem Solving', type: 'viva', count: 5, durationMin: 10, cutoff: 75 },
      { id: 'round_4', name: 'Round 4: HR & Scenario-Based Situations', type: 'hr', count: 5, durationMin: 10, cutoff: 80 }
    ],
    tips: [
      'Accenture questions often include cloud computing and cybersecurity fundamentals.',
      'HR round heavily emphasizes adaptability, teamwork, and willingness to learn new stacks.'
    ]
  },
  {
    id: 'wipro_turbo',
    name: 'Wipro (Elite & Turbo)',
    category: 'Campus Drive',
    logo: 'fa-solid fa-microchip',
    badgeColor: '#059669',
    targetRoles: ['Elite (3.5 LPA)', 'Turbo (6.5 LPA)'],
    description: 'Evaluates logical ability, English comprehension, foundational technical concepts, and business etiquette.',
    rounds: [
      { id: 'round_1', name: 'Round 1: Aptitude & Verbal Ability', type: 'aptitude', count: 10, durationMin: 15, cutoff: 65 },
      { id: 'round_2', name: 'Round 2: Core CS & Programming MCQs', type: 'technical', count: 10, durationMin: 15, cutoff: 65 },
      { id: 'round_3', name: 'Round 3: Project & Architecture Viva', type: 'viva', count: 5, durationMin: 10, cutoff: 70 },
      { id: 'round_4', name: 'Round 4: HR & Cultural Alignment', type: 'hr', count: 5, durationMin: 10, cutoff: 75 }
    ],
    tips: [
      'Verbal comprehension and sentence correction are crucial for scoring high percentiles.',
      'Wipro values clear communication and structured problem solving.'
    ]
  }
];
