// Resume-to-Job Matcher: Gap analysis and targeted prep recommender for any job seeker
import { extractSkills, showToast, escapeHtml } from '../utils/helpers.js';
import { extractTextFromFile } from '../utils/file_parser.js';

const SAMPLE_RESUMES = {
  fullstack: `ALEX MORGAN
Junior Full-Stack Developer | CS Graduate
Technical Skills:
- Languages: JavaScript, TypeScript, Python, HTML5, CSS3, SQL
- Frameworks & Libraries: React, Node.js, Express, Tailwind CSS
- Databases: PostgreSQL, MongoDB, Prisma ORM
- Tools & DevOps: Git, GitHub, Docker, Postman, Linux
Projects:
1. E-Commerce Storefront: Built responsive shopping platform with cart state, Stripe checkout, and JWT auth.
2. Real-Time Chat Application: Engineered messaging app using WebSockets and Express.`,

  frontend: `JORDAN LEE
Frontend Developer & UI Engineer
Technical Skills:
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3/SASS
- Frameworks: React, Next.js, Redux Toolkit, Tailwind CSS
- Web Concepts: Responsive Design, REST APIs, Webpack, Performance Optimization, Accessibility (a11y)
Projects:
1. TaskFlow Kanban App: Interactive drag-and-drop workflow tool with optimistic UI updates.
2. Marketing Analytics UI: Built modular dashboard with Chart.js and dark/light mode.`,

  data_analyst: `PRIYA SHARMA
Data Analyst & Business Intelligence Specialist
Technical Skills:
- Programming: Python (Pandas, NumPy, Matplotlib, Seaborn), SQL (PostgreSQL, MySQL)
- Tools: Tableau, Power BI, Excel (Advanced, Pivot Tables, VBA), Jupyter Notebooks
- Core Competencies: Data Cleaning, Exploratory Data Analysis (EDA), Statistical Hypothesis Testing, ETL Pipelines
Projects:
1. Customer Churn Analysis: Analyzed 20,000+ subscriber records in SQL and built churn prediction dashboards.
2. Sales Performance Tracker: Created automated ETL scripts extracting weekly revenue metrics into Tableau.`,

  sde_core: `DEVON REID
Software Engineering Graduate
Technical Skills:
- Languages: Java, C++, Python, SQL
- Core Fundamentals: Data Structures, Algorithms, OOPs, Operating Systems, Computer Networks, DBMS
- Problem Solving: 350+ LeetCode problems solved; active competitive programmer
Projects:
1. Distributed Cache Prototype: Implemented an in-memory LRU cache in C++ with thread-safe mutex locks.
2. Relational Database Engine Simulator: Built a mini B-Tree indexing query parser in Java.`
};

const SAMPLE_JDS = {
  sde_product: `Junior Software Development Engineer (SDE-1) / Full Stack
Requirements:
- Bachelor's in Computer Science or equivalent hands-on experience.
- Deep expertise in Data Structures, Algorithms, Time and Space Complexities ($O(n)$).
- Proficiency in JavaScript/TypeScript, Java, or Python with clean OOPs principles.
- Experience building RESTful APIs, working with Relational Databases (PostgreSQL/MySQL), and caching (Redis).
- Familiarity with Git, automated testing (Jest/PyTest), and Docker containerization.`,

  frontend_jd: `Junior Frontend UI Developer
Requirements:
- Strong knowledge of modern JavaScript (ES6+), HTML5 semantic markup, and CSS3 / Tailwind CSS.
- Hands-on experience developing single-page web applications with React or Next.js.
- Understanding of state management, component lifecycle, hooks, and REST API integration.
- Passion for responsive design, cross-browser compatibility, and web performance metrics.`,

  data_analyst_jd: `Junior Data Analyst / BI Trainee
Requirements:
- Strong SQL proficiency (Joins, Aggregations, Window Functions, Subqueries).
- Experience with Python data wrangling libraries (Pandas, NumPy) and data visualization.
- Proven ability to build clear executive dashboards in Tableau or Power BI.
- Strong analytical mindset, attention to detail, and ability to communicate findings to stakeholders.`,

  campus_it: `Campus Graduate Trainee / Associate Software Engineer
Requirements:
- Solid understanding of core computer science: OOPs, DBMS, Operating Systems, and Computer Networks.
- Foundational coding ability in Java, Python, or C++ with strong logical aptitude.
- Basic familiarity with web technologies (HTML, CSS, JavaScript) and SQL database queries.
- Strong verbal and written communication skills and eagerness to adapt to enterprise tech stacks.`
};

export class ResumeMatcher {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.resumeText = SAMPLE_RESUMES.fullstack;
    this.jdText = SAMPLE_JDS.sde_product;
    this.matchResult = null;
  }

  init() {
    this.analyzeMatch();
    this.render();
  }

  analyzeMatch() {
    const resumeSkills = extractSkills(this.resumeText);
    const jdSkills = extractSkills(this.jdText);

    const matched = jdSkills.filter(s => resumeSkills.includes(s));
    const missing = jdSkills.filter(s => !resumeSkills.includes(s));
    const bonus = resumeSkills.filter(s => !jdSkills.includes(s));

    const totalRequired = jdSkills.length;
    const matchPercentage = totalRequired > 0 ? Math.round((matched.length / totalRequired) * 100) : 0;

    this.matchResult = {
      resumeSkills,
      jdSkills,
      matched,
      missing,
      bonus,
      matchPercentage
    };
  }

  render() {
    if (!this.container) return;

    const r = this.matchResult;
    const scoreColor = r.matchPercentage >= 75 ? '#10b981' : r.matchPercentage >= 50 ? '#3b82f6' : '#ef4444';

    this.container.innerHTML = `
      <div class="resume-matcher-wrapper">
        <div class="matcher-header">
          <div>
            <h2><i class="fa-solid fa-file-waveform text-accent"></i> Resume-to-Job Matcher & Gap Analyzer</h2>
            <p class="subtitle">Compare any candidate resume against realistic job descriptions. Uncover missing technical keywords and generate an instant targeted interview practice plan.</p>
          </div>
        </div>

        <!-- Role Presets Row for Any Job Seeker -->
        <div class="matcher-presets-row">
          <span><strong>Quick Role Presets:</strong></span>
          <button class="btn btn-outline btn-sm load-preset-btn" data-resume="fullstack" data-jd="sde_product">
            <i class="fa-solid fa-code"></i> Full-Stack Dev + SDE-1 JD
          </button>
          <button class="btn btn-outline btn-sm load-preset-btn" data-resume="frontend" data-jd="frontend_jd">
            <i class="fa-brands fa-react"></i> Frontend Dev + React JD
          </button>
          <button class="btn btn-outline btn-sm load-preset-btn" data-resume="data_analyst" data-jd="data_analyst_jd">
            <i class="fa-solid fa-chart-pie"></i> Data Analyst + BI JD
          </button>
          <button class="btn btn-outline btn-sm load-preset-btn" data-resume="sde_core" data-jd="campus_it">
            <i class="fa-solid fa-building-columns"></i> Campus Fresher + Graduate JD
          </button>
          <button class="btn btn-ghost btn-sm" id="clear-resume-inputs-btn">
            <i class="fa-solid fa-eraser"></i> Clear
          </button>
        </div>

        <!-- Input Split Columns -->
        <div class="matcher-inputs-grid">
          <!-- Resume Box -->
          <div class="matcher-input-card">
            <div class="mic-header">
              <h4><i class="fa-solid fa-id-card text-accent"></i> Candidate Resume Content</h4>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label class="btn btn-outline btn-sm" style="cursor: pointer; padding: 0.25rem 0.65rem;">
                  <i class="fa-solid fa-file-arrow-up text-accent"></i> Upload File
                  <input type="file" id="matcher-file-upload-input" accept=".pdf,.docx,.txt,.md" style="display: none;">
                </label>
                <span class="badge badge-outline">Skills: ${r.resumeSkills.length}</span>
              </div>
            </div>
            <textarea id="resume-input" class="form-control" rows="8" placeholder="Paste your resume content, skills, or project bullet points, or click 'Upload File' above...">${escapeHtml(this.resumeText)}</textarea>
          </div>

          <!-- JD Box -->
          <div class="matcher-input-card">
            <div class="mic-header">
              <h4><i class="fa-solid fa-briefcase text-accent"></i> Target Role Job Description</h4>
              <span class="badge badge-outline">Required Skills: ${r.jdSkills.length}</span>
            </div>
            <textarea id="jd-input" class="form-control" rows="8" placeholder="Paste the target job description requirements...">${escapeHtml(this.jdText)}</textarea>
          </div>
        </div>

        <div class="matcher-action-bar text-center">
          <button class="btn btn-primary btn-lg" id="reanalyze-btn">
            <i class="fa-solid fa-bolt"></i> Analyze Skill Match & Missing Gaps
          </button>
        </div>

        <!-- Analysis Results Card -->
        <div class="matcher-results-card">
          <div class="match-score-banner">
            <div class="match-circle" style="border-color: ${scoreColor}">
              <span class="match-pct" style="color: ${scoreColor}">${r.matchPercentage}%</span>
              <span class="match-lbl">Match</span>
            </div>
            <div class="match-summary-text">
              <h3>${r.matchPercentage >= 75 ? 'Strong Role Alignment!' : r.matchPercentage >= 50 ? 'Moderate Fit with Addressable Gaps' : 'Noticeable Skill Deficit'}</h3>
              <p class="text-muted">Candidate matches <strong>${r.matched.length}</strong> out of <strong>${r.jdSkills.length}</strong> required competencies for this position.</p>
            </div>
          </div>

          <div class="skills-breakdown-grid">
            <!-- Missing Skills (Priority Action) -->
            <div class="skills-col missing-col">
              <h4><i class="fa-solid fa-circle-exclamation text-danger"></i> Missing Skills to Practice (${r.missing.length})</h4>
              <p class="small text-muted">You risk stumbling if grilled on these missing keywords:</p>
              <div class="chips-container">
                ${r.missing.length > 0 ? r.missing.map(s => `<span class="chip chip-missing"><i class="fa-solid fa-plus"></i> ${escapeHtml(s)}</span>`).join('') : '<span class="text-success small">No critical missing skills detected!</span>'}
              </div>
            </div>

            <!-- Matched Skills -->
            <div class="skills-col matched-col">
              <h4><i class="fa-solid fa-circle-check text-success"></i> Matched Competencies (${r.matched.length})</h4>
              <p class="small text-muted">Skills explicitly recognized by automated screening:</p>
              <div class="chips-container">
                ${r.matched.map(s => `<span class="chip chip-matched"><i class="fa-solid fa-check"></i> ${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>

            <!-- Bonus Skills -->
            <div class="skills-col bonus-col">
              <h4><i class="fa-solid fa-star text-warning"></i> Additional Value Skills (${r.bonus.length})</h4>
              <p class="small text-muted">Extra tools on your profile that make you stand out:</p>
              <div class="chips-container">
                ${r.bonus.slice(0, 8).map(s => `<span class="chip chip-bonus">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>
          </div>

          <!-- Targeted Action CTA -->
          <div class="recommended-action-box">
            <div class="rab-info">
              <h4><i class="fa-solid fa-rocket text-accent"></i> Recommended Immediate Practice Plan:</h4>
              <p>Practice interview questions on your missing topics: <strong>${r.missing.slice(0, 4).join(', ') || 'System Basics & Problem Solving'}</strong>.</p>
            </div>
            <button class="btn btn-success" id="launch-tailored-prep-btn">
              Launch Interview Arena Practice <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const resumeInput = document.getElementById('resume-input');
    const jdInput = document.getElementById('jd-input');
    const reanalyzeBtn = document.getElementById('reanalyze-btn');

    if (reanalyzeBtn && resumeInput && jdInput) {
      reanalyzeBtn.addEventListener('click', () => {
        this.resumeText = resumeInput.value;
        this.jdText = jdInput.value;
        this.analyzeMatch();
        this.render();
        showToast('Resume & JD analysis updated!', 'success');
      });
    }

    // File upload for Resume Matcher
    const fileUploadInput = document.getElementById('matcher-file-upload-input');
    if (fileUploadInput) {
      fileUploadInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        showToast(`Extracting text from ${file.name}...`, 'info');
        try {
          const text = await extractTextFromFile(file);
          this.resumeText = text;
          if (resumeInput) resumeInput.value = text;
          this.analyzeMatch();
          this.render();
          showToast(`Successfully extracted ${text.split(/\s+/).length} words from ${file.name}!`, 'success');
        } catch (err) {
          showToast(`File error: ${err.message}`, 'error');
        }
      });
    }

    // Role preset buttons
    this.container.querySelectorAll('.load-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rKey = e.currentTarget.getAttribute('data-resume');
        const jKey = e.currentTarget.getAttribute('data-jd');
        this.resumeText = SAMPLE_RESUMES[rKey] || '';
        this.jdText = SAMPLE_JDS[jKey] || '';
        this.analyzeMatch();
        this.render();
        showToast('Role preset loaded!', 'info');
      });
    });

    // Clear
    const clearBtn = document.getElementById('clear-resume-inputs-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.resumeText = '';
        this.jdText = '';
        this.analyzeMatch();
        this.render();
        showToast('Cleared input fields. Paste your own resume and JD!', 'info');
      });
    }

    // Launch tailored prep
    const launchBtn = document.getElementById('launch-tailored-prep-btn');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        const tab = document.querySelector('[data-tab="placement"]');
        if (tab) tab.click();
      });
    }
  }
}
