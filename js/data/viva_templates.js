// Project Viva Question Bank & Generator Templates
export const VIVA_CATEGORIES = [
  { id: 'fullstack', name: 'Full-Stack Web (React, Node.js, Python, MERN)' },
  { id: 'frontend', name: 'Frontend Web App (React / Next.js / Vue)' },
  { id: 'data_analytics', name: 'Data Analytics & Business Intelligence' },
  { id: 'python_backend', name: 'Python Backend (Django / FastAPI / Flask)' },
  { id: 'java_spring', name: 'Java / Spring Boot Enterprise App' },
  { id: 'mobile_app', name: 'Mobile App (Flutter / React Native)' },
  { id: 'cybersecurity', name: 'Security & Auth System' },
  { id: 'iot_embedded', name: 'IoT / Embedded Systems & Hardware' }
];

export const GENERAL_VIVA_PROBES = [
  {
    topic: 'Architecture & System Flow',
    question: (title, stack) => `Walk me through the high-level architecture of "${title}". When a user triggers an action on the UI, what is the end-to-end path of that request through your ${stack} stack?`,
    evalFocus: 'Understanding of Client-Server request/response lifecycle, REST/GraphQL endpoints, middleware, controller-service layers, and database commits.',
    defenseStrategy: 'Trace chronologically: Client event -> HTTP Request -> API Gateway / Route -> Auth Middleware -> Controller -> Business Logic Service -> DB Query -> JSON Response -> UI state update.',
    keyTerms: ['Client-Server', 'Middleware', 'Controller', 'Service Layer', 'ORM/ODM', 'HTTP Status Codes']
  },
  {
    topic: 'Database & Data Modeling',
    question: (title, stack, db) => `In "${title}", how is your database (${db || 'database'}) designed? Why did you pick this over a relational/NoSQL alternative, and what indices did you create?`,
    evalFocus: 'Relational vs Non-relational trade-offs (ACID vs Flexible schema), foreign keys, indexing performance, and query optimization.',
    defenseStrategy: 'Justify choices based on access patterns: "We prioritized relational integrity and transactional ACID guarantees" or "We needed rapid prototyping with semi-structured JSON documents". Mention at least one indexed foreign key or email/id lookup.',
    keyTerms: ['ACID properties', 'Normalization', 'B-Tree Indexing', 'Schema validation', 'Query execution plan']
  },
  {
    topic: 'Authentication & Security',
    question: (title, stack) => `How did you implement security and authentication in "${title}"? How are passwords stored and how do you protect against common vulnerabilities like SQL injection or CSRF?`,
    evalFocus: 'JWT vs Session cookies, bcrypt/Argon2 hashing with salts, parameterized queries, and CORS configuration.',
    defenseStrategy: 'Explain password hashing: "Passwords are never stored in plaintext; we hash them using bcrypt with salt rounds". For API authorization: "Stateless JWT tokens passed in Authorization Bearer headers or HTTP-only secure cookies".',
    keyTerms: ['bcrypt salt', 'JWT (JSON Web Token)', 'HTTP-only cookies', 'Parameterized queries', 'CORS policies']
  },
  {
    topic: 'Scalability & Concurrency',
    question: (title, stack) => `If "${title}" suddenly went viral and received 10,000 requests per minute, what would break first in your architecture, and how would you fix it?`,
    evalFocus: 'Ability to identify single points of failure, bottleneck analysis (database connection pools, un-cached read queries, memory leaks), and caching.',
    defenseStrategy: 'Honest bottleneck identification: "The database would likely bottleneck on repeated identical read queries. We would introduce Redis caching for hot reads, connection pooling (e.g. pg-pool / HikariCP), and load balancing across horizontal instances".',
    keyTerms: ['Redis cache', 'Connection Pooling', 'Horizontal scaling', 'Reverse proxy / Nginx', 'Rate limiting']
  },
  {
    topic: 'Troubleshooting & The Hardest Bug',
    question: (title) => `What was the most difficult bug or technical roadblock you encountered while engineering "${title}", and how did you diagnose and solve it?`,
    evalFocus: 'Debugging methodology (logs, breakpoints, profiling, network tab) and resilience under frustration.',
    defenseStrategy: 'Use the 3-step triage: 1. Symptom observed (e.g., race condition, silent token expiration, memory leak). 2. How you isolated the root cause (browser network inspector, database slow-query log, server console traces). 3. The precise architectural fix.',
    keyTerms: ['Root-cause analysis', 'Network tab inspector', 'Server logs', 'Unit tests', 'Asynchronous race condition']
  },
  {
    topic: 'Future Roadmap & Self-Critique',
    question: (title) => `Looking back at "${title}" today with what you now know, what architectural decision would you redesign or what feature would you implement next?`,
    evalFocus: 'Continuous growth mindset, willingness to accept flaws in earlier student code, and modern best practices (CI/CD, automated tests, Docker).',
    defenseStrategy: 'Acknowledge technical debt gracefully: "I would add automated unit & integration tests using Jest/PyTest, containerize the application with Docker for seamless CI/CD, and decouple the monolithic backend into modular microservices".',
    keyTerms: ['CI/CD Pipeline', 'Docker containerization', 'Automated testing', 'Modular microservices', 'Observability']
  }
];

// Universal Real-World Projects for any student, job seeker, or developer
export const PRESET_PROJECTS = [
  {
    title: 'Full-Stack E-Commerce Storefront with Payment Gateway',
    category: 'fullstack',
    techStack: 'React, Node.js, Express, Tailwind CSS',
    database: 'PostgreSQL / Prisma ORM',
    description: 'A modern online shopping store with inventory tracking, JWT authentication, cart persistence, and webhook-verified Stripe/Razorpay payments.'
  },
  {
    title: 'TaskFlow - Collaborative Kanban Board (Trello Clone)',
    category: 'fullstack',
    techStack: 'React, TypeScript, Tailwind CSS, Express, REST APIs',
    database: 'MongoDB / Mongoose',
    description: 'An everyday productivity and agile sprint management web app with drag-and-drop tasks, column workflows, and activity audit logs.'
  },
  {
    title: 'Real-Time Team Messaging & Chat Workspace',
    category: 'fullstack',
    techStack: 'React, Node.js, Socket.IO / WebSockets, Express',
    database: 'MongoDB & Redis Pub/Sub',
    description: 'A live chat application supporting direct messages, public channels, typing indicators, and instant read receipts.'
  },
  {
    title: 'Sales & Customer Analytics Intelligence Dashboard',
    category: 'data_analytics',
    techStack: 'Python, FastAPI, Pandas, Chart.js, SQL',
    database: 'PostgreSQL / Data Warehouse',
    description: 'An interactive business analytics dashboard displaying sales revenue metrics, churn predictions, and cohort retention charts.'
  },
  {
    title: 'Cloud Secure File Vault & Document Sharing System',
    category: 'python_backend',
    techStack: 'Python, Django, AWS S3, HTML5/CSS3',
    database: 'PostgreSQL / SQLite',
    description: 'A cloud document sharing system featuring role-based access control (RBAC), presigned upload URLs, and file encryption.'
  },
  {
    title: 'IoT Environmental & Smart Energy Telemetry Tracker',
    category: 'iot_embedded',
    techStack: 'ESP32 / Arduino, MQTT, Node.js, WebSockets, Chart.js',
    database: 'InfluxDB & MongoDB',
    description: 'A real-time environmental monitoring system streaming sensor telemetry over MQTT to a live web dashboard.'
  }
];
