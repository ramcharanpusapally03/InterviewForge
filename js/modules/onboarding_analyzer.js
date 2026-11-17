// Onboarding & CV/Portfolio Analyzer: Matches candidate profiles to eligible companies & job roles
import { COMPANY_TRACKS } from '../data/companies.js';
import { extractSkills, showToast, escapeHtml } from '../utils/helpers.js';
import { extractTextFromFile } from '../utils/file_parser.js';
import { appState } from '../state.js';

// Preloaded sample candidate profiles so any user can test with 1 click
export const SAMPLE_CANDIDATE_CVS = {
  web_fullstack: `ALEX RIVERA
Full-Stack Web Developer & Engineering Graduate
Skills: JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, MongoDB, HTML5, CSS3, Tailwind CSS, Git, REST APIs
Projects:
1. CloudMart E-Commerce: Built a full-stack shopping application with user authentication, PostgreSQL database, and Stripe payment integration.
2. DevCollab Real-Time Chat: Created a group collaboration app using WebSockets and Express.`,

  frontend_react: `JORDAN BLAKE
Frontend Developer & UI Engineer
Skills: React, JavaScript, HTML5, CSS3, Tailwind CSS, Redux Toolkit, Next.js, Web Performance, Responsive Design, Git
Projects:
1. TaskFlow Kanban Manager: Drag-and-drop workflow productivity board with optimistic UI updates.
2. CryptoMetrics Dashboard: Real-time price chart interface using Chart.js and CoinGecko API.`,

  data_analyst: `PRIYA PATEL
Data Analyst & Business Intelligence Specialist
Skills: Python, SQL, PostgreSQL, Pandas, NumPy, Tableau, Power BI, Excel, Data Modeling, Statistics, Problem Solving
Projects:
1. Customer Churn Prediction: Modeled subscriber churn probability from 15,000 records using SQL and Pandas.
2. Executive Sales KPI Dashboard: Automated weekly ETL pipelines feeding interactive Tableau dashboards.`,

  campus_fresher: `ROHAN MEHTA
Computer Science & Engineering Student (2022-2026)
Skills: Java, C++, Python, Data Structures, Algorithms, OOPs, DBMS, SQL, Operating Systems, Computer Networks, Problem Solving
Projects:
1. Smart Student Attendance Tracker: Desktop and web application managing student database records with MySQL.
2. Algorithm Visualizer: Interactive visual sorting and pathfinding visualizer built with JavaScript.`
};

export class OnboardingAnalyzer {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.currentView = 'input'; // 'input' | 'results' | 'manual'
    this.inputMode = 'file'; // 'file' | 'text'
    this.inputText = '';
    this.uploadedFile = null;
    this.uploadedFileName = '';
    this.uploadedFileSize = '';
    this.isParsing = false;
    this.parseProgress = '';
    this.analysisResults = null;
    this.selectedTrackId = null;
  }

  init() {
    this.render();
  }

  show() {
    if (this.modal) {
      this.modal.style.display = 'flex';
      this.render();
    }
  }

  hide() {
    if (this.modal) {
      this.modal.style.display = 'none';
    }
  }

  analyzeText(text) {
    const rawText = text || '';
    const detectedSkills = extractSkills(rawText);

    // Score against all tracks in COMPANY_TRACKS
    const scoredTracks = COMPANY_TRACKS.map(track => {
      // Build skill expectations based on track description, tips, and name
      const trackKeywords = extractSkills(
        `${track.name} ${track.description} ${track.targetRoles.join(' ')} ${track.tips.join(' ')}`
      );

      // Add category essentials
      if (track.id.includes('frontend')) {
        trackKeywords.push('react', 'javascript', 'html', 'css', 'typescript', 'tailwind');
      } else if (track.id.includes('data')) {
        trackKeywords.push('python', 'sql', 'pandas', 'postgresql', 'tableau', 'statistics');
      } else if (track.id.includes('cyber')) {
        trackKeywords.push('computer networks', 'security', 'sql', 'python', 'oops');
      } else if (track.id.includes('sde') || track.id.includes('product')) {
        trackKeywords.push('data structures', 'algorithms', 'oops', 'dbms', 'operating systems', 'system design');
      } else {
        // Campus giant track
        trackKeywords.push('data structures', 'oops', 'dbms', 'problem solving', 'python', 'java', 'sql');
      }

      const uniqueRequired = Array.from(new Set(trackKeywords));
      const matched = uniqueRequired.filter(s => detectedSkills.includes(s));
      const missing = uniqueRequired.filter(s => !detectedSkills.includes(s));

      const matchPct = uniqueRequired.length > 0
        ? Math.min(Math.round((matched.length / Math.min(uniqueRequired.length, 6)) * 100), 98)
        : 60;

      return {
        track,
        matchPct: Math.max(matchPct, 25),
        matchedSkills: matched,
        missingSkills: missing.slice(0, 4)
      };
    });

    // Sort descending by match percentage
    scoredTracks.sort((a, b) => b.matchPct - a.matchPct);

    // Extract potential project names from text (looks for "Projects:" or numbered lines)
    const detectedProjects = [];
    const lines = rawText.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (/^(1\.|2\.|3\.|-|\*)\s+([A-Za-z0-9\s\-]+):/i.test(trimmed) || /^(Project|Title):\s*(.+)/i.test(trimmed)) {
        const cleanTitle = trimmed.replace(/^(1\.|2\.|3\.|-|\*|Project:|Title:)\s*/i, '').split(':')[0].trim();
        if (cleanTitle.length > 3 && cleanTitle.length < 50) {
          detectedProjects.push(cleanTitle);
        }
      }
    });

    this.analysisResults = {
      detectedSkills,
      scoredTracks,
      detectedProjects,
      topTrack: scoredTracks[0]
    };

    this.selectedTrackId = scoredTracks[0]?.track.id || 'product_sde1';
  }

  render() {
    if (!this.modal) return;

    const dialog = this.modal.querySelector('.modal-dialog') || this.modal;

    if (this.currentView === 'input') {
      this.renderInputView(dialog);
    } else if (this.currentView === 'results') {
      this.renderResultsView(dialog);
    } else if (this.currentView === 'manual') {
      this.renderManualView(dialog);
    }

    this.bindEvents();
  }

  renderInputView(dialog) {
    const wordCount = this.inputText.trim() ? this.inputText.trim().split(/\s+/).length : 0;

    dialog.innerHTML = `
      <div class="onboarding-modal-content">
        <div class="modal-header">
          <div class="header-brand-lead">
            <div class="lead-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
            <div>
              <h3>AI CV & Portfolio Analyzer</h3>
              <p class="subtitle" style="margin-bottom: 0;">Upload your resume file or paste text to discover eligible companies and roles.</p>
            </div>
          </div>
          <button class="btn-close-modal" id="close-onboarding-btn">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Dual Input Mode Selector Tabs -->
          <div class="upload-mode-nav">
            <button class="upload-mode-tab ${this.inputMode === 'file' ? 'active' : ''}" data-mode="file">
              <i class="fa-solid fa-file-arrow-up"></i> Upload CV File (PDF / Word / TXT)
            </button>
            <button class="upload-mode-tab ${this.inputMode === 'text' ? 'active' : ''}" data-mode="text">
              <i class="fa-solid fa-keyboard"></i> Paste Text / Bio
            </button>
          </div>

          <!-- MODE 1: FILE UPLOAD ZONE -->
          ${this.inputMode === 'file' ? `
            <div class="file-upload-section">
              <div class="dropzone-box" id="cv-dropzone">
                <input type="file" id="cv-file-upload-input" accept=".pdf,.docx,.txt,.md" style="display: none;">
                
                ${this.isParsing ? `
                  <div class="dropzone-parsing">
                    <i class="fa-solid fa-spinner fa-spin text-accent text-3xl"></i>
                    <h4>Parsing Document...</h4>
                    <p class="small text-muted" id="parsing-progress-text">${escapeHtml(this.parseProgress || 'Extracting text from pages...')}</p>
                  </div>
                ` : this.uploadedFileName ? `
                  <div class="dropzone-file-ready">
                    <div class="file-icon-badge">
                      <i class="fa-solid ${this.uploadedFileName.endsWith('.pdf') ? 'fa-file-pdf text-danger' : this.uploadedFileName.endsWith('.docx') ? 'fa-file-word text-primary' : 'fa-file-lines text-accent'}"></i>
                    </div>
                    <div class="file-meta">
                      <h4>${escapeHtml(this.uploadedFileName)}</h4>
                      <p class="small text-muted">${escapeHtml(this.uploadedFileSize)} &bull; <strong class="text-success">${wordCount} words extracted</strong></p>
                    </div>
                    <button class="btn btn-outline btn-sm" id="change-file-btn" type="button">
                      <i class="fa-solid fa-rotate-left"></i> Change File
                    </button>
                  </div>
                ` : `
                  <div class="dropzone-idle">
                    <div class="dropzone-icon">
                      <i class="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <h4>Drag and drop your CV file here</h4>
                    <p class="small text-muted">Supports <strong>PDF (.pdf)</strong>, <strong>Word (.docx)</strong>, or <strong>Text (.txt)</strong></p>
                    <button class="btn btn-outline btn-sm" id="browse-file-btn" type="button" style="margin-top: 0.75rem;">
                      <i class="fa-solid fa-folder-open"></i> Browse Computer
                    </button>
                  </div>
                `}
              </div>

              ${this.inputText ? `
                <div class="extracted-text-preview-box">
                  <div class="etp-header">
                    <span class="small text-muted"><i class="fa-solid fa-circle-check text-success"></i> Extracted Resume Content Preview:</span>
                    <button class="btn-toggle-preview" id="toggle-preview-btn">Show / Edit Text</button>
                  </div>
                  <textarea id="onboarding-cv-text" class="form-control" rows="5" style="display: none; font-size: 0.85rem;" placeholder="Extracted text...">${escapeHtml(this.inputText)}</textarea>
                </div>
              ` : ''}
            </div>
          ` : `
            <!-- MODE 2: PASTE TEXT -->
            <div class="paste-text-section">
              <!-- Quick Sample Profiles -->
              <div class="sample-cv-ribbon">
                <span>Or load a sample profile:</span>
                <button class="btn btn-outline btn-sm load-cv-sample" data-sample="web_fullstack">Full-Stack Dev</button>
                <button class="btn btn-outline btn-sm load-cv-sample" data-sample="frontend_react">Frontend UI</button>
                <button class="btn btn-outline btn-sm load-cv-sample" data-sample="data_analyst">Data Analyst</button>
                <button class="btn btn-outline btn-sm load-cv-sample" data-sample="campus_fresher">Campus Fresher</button>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fa-solid fa-file-lines text-accent"></i> Paste Your CV Text, Portfolio Bio, or Project Summaries:
                </label>
                <textarea 
                  id="onboarding-cv-text" 
                  class="form-control" 
                  rows="8" 
                  placeholder="Paste your resume skills, experience, and project descriptions here...&#10;&#10;e.g.:&#10;Skills: JavaScript, React, Python, SQL, Node.js&#10;Projects: Built an E-Commerce storefront with cart state and payment gateway..."
                >${escapeHtml(this.inputText)}</textarea>
              </div>
            </div>
          `}

          <div class="onboarding-choice-divider">
            <span>OR PREFER TO CHOOSE YOURSELF?</span>
          </div>

          <div class="manual-fallback-box text-center">
            <button class="btn btn-ghost" id="go-manual-select-btn">
              <i class="fa-solid fa-list-check"></i> Skip CV analysis & manually select your target role or company
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" id="skip-onboarding-btn">Close</button>
          <button class="btn btn-primary btn-lg" id="analyze-cv-btn" ${!this.inputText.trim() && !this.isParsing ? 'disabled' : ''}>
            <i class="fa-solid fa-bolt"></i> Analyze Profile & Show Eligible Roles
          </button>
        </div>
      </div>
    `;
  }

  renderResultsView(dialog) {
    const res = this.analysisResults;
    if (!res) return;

    const top = res.topTrack;

    dialog.innerHTML = `
      <div class="onboarding-modal-content">
        <div class="modal-header">
          <div class="header-brand-lead">
            <div class="lead-icon" style="background: rgba(16, 185, 129, 0.2); color: #10b981;"><i class="fa-solid fa-circle-check"></i></div>
            <div>
              <h3>Profile Analysis & Eligibility Results</h3>
              <p class="subtitle" style="margin-bottom: 0;">Matched against national recruiters & career tracks.</p>
            </div>
          </div>
          <button class="btn-close-modal" id="close-onboarding-btn">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Source info -->
          ${this.uploadedFileName ? `
            <div class="analyzed-source-pill">
              <i class="fa-solid fa-file-check text-success"></i> Analyzed Source: <strong>${escapeHtml(this.uploadedFileName)}</strong>
            </div>
          ` : ''}

          <!-- Detected Skills Cloud -->
          <div class="detected-skills-bar">
            <span class="dsb-title">Detected Competencies (${res.detectedSkills.length}):</span>
            <div class="chips-container" style="margin-top: 0.35rem;">
              ${res.detectedSkills.length > 0 
                ? res.detectedSkills.map(s => `<span class="chip chip-matched"><i class="fa-solid fa-check"></i> ${escapeHtml(s)}</span>`).join('') 
                : '<span class="text-muted small">No specific technical keywords detected. Pick a role below.</span>'}
            </div>
          </div>

          <!-- Top Match Callout Banner -->
          <div class="top-match-hero-card">
            <div class="tmh-left">
              <div class="match-score-pill">
                <span class="msp-pct">${top.matchPct}%</span>
                <span class="msp-lbl">Best Fit</span>
              </div>
              <div class="tmh-info">
                <h4>Top Recommended Track: ${escapeHtml(top.track.name)}</h4>
                <p class="small text-muted">${escapeHtml(top.track.description)}</p>
                <div class="roles-pill-row" style="margin-top: 0.4rem; margin-bottom: 0;">
                  ${top.track.targetRoles.map(r => `<span class="role-pill">${escapeHtml(r)}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Eligible Tracks List -->
          <h4 style="margin: 1.25rem 0 0.75rem;"><i class="fa-solid fa-building-circle-check text-accent"></i> Eligible Roles & Hiring Drives</h4>
          <p class="small text-muted" style="margin-bottom: 1rem;">Click any track to select it as your active practice goal:</p>

          <div class="eligible-tracks-list">
            ${res.scoredTracks.map(item => {
              const isSelected = item.track.id === this.selectedTrackId;
              const color = item.matchPct >= 70 ? '#10b981' : item.matchPct >= 50 ? '#3b82f6' : '#f59e0b';

              return `
                <div class="eligible-track-card ${isSelected ? 'selected-track' : ''}" data-track-id="${item.track.id}">
                  <div class="etc-icon" style="color: ${item.track.badgeColor}; background: ${item.track.badgeColor}20;">
                    <i class="${item.track.logo}"></i>
                  </div>
                  <div class="etc-info">
                    <div class="etc-header">
                      <h5>${escapeHtml(item.track.name)}</h5>
                      <span class="badge" style="background: ${color}20; color: ${color}; font-weight: 700;">
                        ${item.matchPct}% Compatibility
                      </span>
                    </div>
                    <p class="small text-muted">${escapeHtml(item.track.category)} &bull; ${item.track.rounds.length} Selection Rounds</p>
                    ${item.missingSkills.length > 0 ? `
                      <div class="missing-prep-tags">
                        <span class="small text-muted">To hit 95%+ prep:</span>
                        ${item.missingSkills.map(m => `<span class="chip chip-missing" style="font-size: 0.7rem;">+ ${escapeHtml(m)}</span>`).join('')}
                      </div>
                    ` : ''}
                  </div>
                  <div class="etc-select-indicator">
                    <i class="fa-solid ${isSelected ? 'fa-circle-check text-success' : 'fa-circle text-muted'}"></i>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" id="back-to-cv-input-btn">
            <i class="fa-solid fa-arrow-left"></i> Change File / Edit Text
          </button>
          <button class="btn btn-success btn-lg" id="launch-custom-plan-btn">
            Launch Personalized Practice Plan <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  renderManualView(dialog) {
    dialog.innerHTML = `
      <div class="onboarding-modal-content">
        <div class="modal-header">
          <div class="header-brand-lead">
            <div class="lead-icon"><i class="fa-solid fa-sliders"></i></div>
            <div>
              <h3>Choose Your Target Role or Company</h3>
              <p class="subtitle" style="margin-bottom: 0;">Select your career track to customize your daily workout and practice arena.</p>
            </div>
          </div>
          <button class="btn-close-modal" id="close-onboarding-btn">&times;</button>
        </div>

        <div class="modal-body">
          <div class="manual-tracks-grid">
            ${COMPANY_TRACKS.map(t => {
              const isSelected = t.id === this.selectedTrackId;
              return `
                <div class="manual-track-card ${isSelected ? 'selected' : ''}" data-track-id="${t.id}">
                  <div class="mtc-header">
                    <div class="mtc-icon" style="color: ${t.badgeColor}; background: ${t.badgeColor}20;">
                      <i class="${t.logo}"></i>
                    </div>
                    <span class="badge badge-outline">${t.category}</span>
                  </div>
                  <h5>${escapeHtml(t.name)}</h5>
                  <p class="small text-muted">${escapeHtml(t.description)}</p>
                  <div class="roles-pill-row" style="margin-top: 0.5rem; margin-bottom: 0;">
                    ${t.targetRoles.map(r => `<span class="role-pill">${escapeHtml(r)}</span>`).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" id="back-to-cv-btn">
            <i class="fa-solid fa-arrow-left"></i> Back to CV Uploader
          </button>
          <button class="btn btn-primary btn-lg" id="apply-manual-track-btn">
            Set As My Practice Goal <i class="fa-solid fa-check"></i>
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Close / skip buttons
    const closeBtns = this.modal.querySelectorAll('#close-onboarding-btn, #skip-onboarding-btn');
    closeBtns.forEach(btn => btn.addEventListener('click', () => this.hide()));

    // Input mode switch tabs (File vs Text)
    this.modal.querySelectorAll('.upload-mode-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const mode = e.currentTarget.getAttribute('data-mode');
        this.inputMode = mode;
        this.render();
      });
    });

    // File Input & Dropzone
    const dropzone = document.getElementById('cv-dropzone');
    const fileInput = document.getElementById('cv-file-upload-input');
    const browseBtn = document.getElementById('browse-file-btn');
    const changeFileBtn = document.getElementById('change-file-btn');

    if (browseBtn && fileInput) {
      browseBtn.addEventListener('click', () => fileInput.click());
    }
    if (changeFileBtn && fileInput) {
      changeFileBtn.addEventListener('click', () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) this.handleUploadedFile(file);
      });
    }

    if (dropzone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('dropzone-active');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('dropzone-active');
        }, false);
      });

      dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        if (file) this.handleUploadedFile(file);
      });
    }

    // Toggle Preview
    const togglePreviewBtn = document.getElementById('toggle-preview-btn');
    const previewTextarea = document.getElementById('onboarding-cv-text');
    if (togglePreviewBtn && previewTextarea) {
      togglePreviewBtn.addEventListener('click', () => {
        const isHidden = previewTextarea.style.display === 'none';
        previewTextarea.style.display = isHidden ? 'block' : 'none';
        togglePreviewBtn.textContent = isHidden ? 'Hide Text' : 'Show / Edit Text';
      });
      previewTextarea.addEventListener('input', (e) => {
        this.inputText = e.target.value;
      });
    }

    // Sample CV loader buttons (in text mode)
    this.modal.querySelectorAll('.load-cv-sample').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sampleKey = e.currentTarget.getAttribute('data-sample');
        const textEl = document.getElementById('onboarding-cv-text');
        if (SAMPLE_CANDIDATE_CVS[sampleKey]) {
          this.inputText = SAMPLE_CANDIDATE_CVS[sampleKey];
          this.uploadedFileName = `Sample_${sampleKey}.txt`;
          this.uploadedFileSize = 'Sample';
          if (textEl) textEl.value = this.inputText;
          showToast('Sample profile loaded. Click Analyze!', 'info');
          this.render();
        }
      });
    });

    // Analyze CV Click
    const analyzeBtn = document.getElementById('analyze-cv-btn');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        const textFromTextarea = document.getElementById('onboarding-cv-text')?.value;
        const text = textFromTextarea || this.inputText;

        if (!text || text.trim().length < 20) {
          showToast('Please upload a resume file or paste your CV text before analyzing.', 'warning');
          return;
        }

        this.inputText = text;
        this.analyzeText(text);
        this.currentView = 'results';
        this.render();
        showToast('Profile analyzed! Review your eligible roles and companies below.', 'success');
      });
    }

    // Go to manual select
    const goManualBtn = document.getElementById('go-manual-select-btn');
    if (goManualBtn) {
      goManualBtn.addEventListener('click', () => {
        this.currentView = 'manual';
        this.selectedTrackId = appState.state.user.targetCompany || 'product_sde1';
        this.render();
      });
    }

    // Back to CV input from results
    const backToCvBtn = document.getElementById('back-to-cv-input-btn');
    if (backToCvBtn) {
      backToCvBtn.addEventListener('click', () => {
        this.currentView = 'input';
        this.render();
      });
    }

    // Back to CV from manual
    const backToCvManualBtn = document.getElementById('back-to-cv-btn');
    if (backToCvManualBtn) {
      backToCvManualBtn.addEventListener('click', () => {
        this.currentView = 'input';
        this.render();
      });
    }

    // Track card selection in Results view
    this.modal.querySelectorAll('.eligible-track-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const trackId = e.currentTarget.getAttribute('data-track-id');
        this.selectedTrackId = trackId;
        this.modal.querySelectorAll('.eligible-track-card').forEach(c => {
          c.classList.toggle('selected-track', c.getAttribute('data-track-id') === trackId);
          const icon = c.querySelector('.etc-select-indicator i');
          if (icon) {
            icon.className = c.getAttribute('data-track-id') === trackId 
              ? 'fa-solid fa-circle-check text-success' 
              : 'fa-solid fa-circle text-muted';
          }
        });
      });
    });

    // Manual card click
    this.modal.querySelectorAll('.manual-track-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const trackId = e.currentTarget.getAttribute('data-track-id');
        this.selectedTrackId = trackId;
        this.modal.querySelectorAll('.manual-track-card').forEach(c => {
          c.classList.toggle('selected', c.getAttribute('data-track-id') === trackId);
        });
      });
    });

    // Launch personalized plan button (from results)
    const launchPlanBtn = document.getElementById('launch-custom-plan-btn');
    if (launchPlanBtn) {
      launchPlanBtn.addEventListener('click', () => {
        this.applySelectedPlan();
      });
    }

    // Apply manual track button
    const applyManualBtn = document.getElementById('apply-manual-track-btn');
    if (applyManualBtn) {
      applyManualBtn.addEventListener('click', () => {
        this.applySelectedPlan();
      });
    }
  }

  async handleUploadedFile(file) {
    this.uploadedFile = file;
    this.uploadedFileName = file.name;
    this.uploadedFileSize = (file.size / 1024).toFixed(1) + ' KB';
    this.isParsing = true;
    this.parseProgress = 'Reading document...';
    this.render();

    try {
      const extractedText = await extractTextFromFile(file, (msg) => {
        this.parseProgress = msg;
        const progressEl = document.getElementById('parsing-progress-text');
        if (progressEl) progressEl.textContent = msg;
      });

      this.inputText = extractedText;
      this.isParsing = false;
      showToast(`Successfully extracted ${extractedText.split(/\s+/).length} words from ${file.name}!`, 'success');
      this.render();
    } catch (err) {
      this.isParsing = false;
      this.uploadedFileName = '';
      showToast(`File error: ${err.message}`, 'error');
      this.render();
    }
  }

  applySelectedPlan() {
    const chosenTrack = COMPANY_TRACKS.find(t => t.id === this.selectedTrackId) || COMPANY_TRACKS[0];

    // Save profile state
    appState.updateUserProfile({
      targetCompany: chosenTrack.id,
      targetRole: chosenTrack.targetRoles[0] || chosenTrack.name,
      extractedSkills: this.analysisResults?.detectedSkills || []
    });

    showToast(`Personalized plan activated for ${chosenTrack.name}!`, 'success');
    this.hide();

    // Route user directly to Career Arena with this track loaded
    if (window.app && typeof window.app.switchTab === 'function') {
      window.app.switchTab('placement');
      if (window.app.modules.placement) {
        window.app.modules.placement.selectTrack(chosenTrack.id);
      }
    }
  }
}
