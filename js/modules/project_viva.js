// Project Viva Trainer: Grilling simulator for college academic & resume projects
import { PRESET_PROJECTS, GENERAL_VIVA_PROBES } from '../data/viva_templates.js';
import { appState } from '../state.js';
import { speechController } from '../utils/speech.js';
import { aiService } from './ai_service.js';
import { showToast, escapeHtml } from '../utils/helpers.js';

export class ProjectVivaTrainer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeProject = PRESET_PROJECTS[0];
    this.activeProbeIndex = 0;
    this.generatedProbes = [];
    this.candidateAnswer = '';
    this.isRecording = false;
  }

  init() {
    this.loadActiveProject();
  }

  getAllProjects() {
    return [...PRESET_PROJECTS, ...appState.state.savedProjects];
  }

  loadActiveProject(project) {
    if (project) {
      this.activeProject = project;
    } else {
      const all = this.getAllProjects();
      this.activeProject = all[0] || PRESET_PROJECTS[0];
    }
    this.generateProbesForProject();
    this.activeProbeIndex = 0;
    this.candidateAnswer = '';
    this.render();
  }

  generateProbesForProject() {
    const p = this.activeProject;
    this.generatedProbes = GENERAL_VIVA_PROBES.map(probe => {
      let qText = '';
      if (probe.topic === 'Architecture & System Flow') {
        qText = probe.question(p.title, p.techStack);
      } else if (probe.topic === 'Database & Data Modeling') {
        qText = probe.question(p.title, p.techStack, p.database);
      } else if (probe.topic === 'Scalability & Concurrency' || probe.topic === 'Authentication & Security') {
        qText = probe.question(p.title, p.techStack);
      } else {
        qText = probe.question(p.title);
      }

      return {
        topic: probe.topic,
        question: qText,
        evalFocus: probe.evalFocus,
        defenseStrategy: probe.defenseStrategy,
        keyTerms: probe.keyTerms
      };
    });
  }

  render() {
    if (!this.container) return;

    const allProjects = this.getAllProjects();
    const probe = this.generatedProbes[this.activeProbeIndex] || this.generatedProbes[0];

    this.container.innerHTML = `
      <div class="viva-trainer-wrapper">
        <!-- Header -->
        <div class="viva-header">
          <div>
            <h2><i class="fa-solid fa-graduation-cap text-accent"></i> Project Viva Defense Studio</h2>
            <p class="subtitle">In 80% of technical rounds, campus interviewers grill candidates on their final year & resume projects. Practice defending your architecture, database schema, scalability, and bugs.</p>
          </div>
          <button class="btn btn-outline" id="add-custom-proj-btn">
            <i class="fa-solid fa-plus"></i> Add Your College Project
          </button>
        </div>

        <!-- Project Selector Ribbon -->
        <div class="project-ribbon">
          <div class="ribbon-label">Select Project to Defend:</div>
          <div class="ribbon-pills">
            ${allProjects.map((p, idx) => {
              const isSelected = p.title === this.activeProject.title;
              return `
                <button class="project-pill ${isSelected ? 'active' : ''}" data-proj-title="${escapeHtml(p.title)}">
                  <i class="fa-solid fa-folder-open"></i> ${escapeHtml(p.title)}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Project Details Card -->
        <div class="project-summary-box">
          <div class="proj-sum-left">
            <h3 class="proj-title">${escapeHtml(this.activeProject.title)}</h3>
            <p class="proj-desc">${escapeHtml(this.activeProject.description || 'College engineering project.')}</p>
          </div>
          <div class="proj-sum-right">
            <div class="meta-item">
              <span class="meta-label">Tech Stack:</span>
              <span class="meta-val">${escapeHtml(this.activeProject.techStack || 'HTML, CSS, JS')}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Database / Storage:</span>
              <span class="meta-val">${escapeHtml(this.activeProject.database || 'Relational / NoSQL')}</span>
            </div>
          </div>
        </div>

        <!-- Viva Station: Probe Stepper & Answer Pane -->
        <div class="viva-station-grid">
          <!-- Left: 6 Viva Grilling Probes List -->
          <div class="viva-probes-sidebar">
            <h4><i class="fa-solid fa-list-ol text-accent"></i> Grilling Defense Probes</h4>
            <div class="probe-list">
              ${this.generatedProbes.map((item, idx) => {
                const isActive = idx === this.activeProbeIndex;
                return `
                  <div class="probe-item ${isActive ? 'active' : ''}" data-probe-idx="${idx}">
                    <div class="probe-num">0${idx + 1}</div>
                    <div class="probe-info">
                      <span class="probe-topic">${escapeHtml(item.topic)}</span>
                      <p class="probe-preview">${escapeHtml(item.question.slice(0, 65))}...</p>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Right: Interactive Answering Console -->
          <div class="viva-response-stage">
            <div class="viva-question-card">
              <div class="vq-header">
                <span class="badge badge-accent">Probe ${this.activeProbeIndex + 1} of 6</span>
                <span class="badge badge-topic">${escapeHtml(probe.topic)}</span>
                <button class="btn btn-outline btn-sm" id="viva-tts-btn">
                  <i class="fa-solid fa-volume-high"></i> Listen
                </button>
              </div>

              <h3 class="vq-text">"${escapeHtml(probe.question)}"</h3>

              <div class="vq-eval-hint">
                <i class="fa-solid fa-eye text-accent"></i>
                <span><strong>Interviewer is testing:</strong> ${escapeHtml(probe.evalFocus)}</span>
              </div>

              <div class="key-terms-row">
                <span class="terms-title">Buzzwords to use:</span>
                ${probe.keyTerms.map(t => `<span class="term-chip">${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>

            <!-- Answer Input Area -->
            <div class="viva-input-box">
              <div class="vib-topbar">
                <label class="form-label">Explain your defense response:</label>
                <button class="btn btn-mic btn-sm ${this.isRecording ? 'recording' : ''}" id="viva-mic-btn">
                  <i class="fa-solid ${this.isRecording ? 'fa-microphone-slash' : 'fa-microphone'}"></i>
                  <span>${this.isRecording ? 'Listening...' : 'Speak Defense (Mic)'}</span>
                </button>
              </div>

              <textarea id="viva-textarea" class="form-control" rows="5" placeholder="Walk through your architectural reasoning, trade-offs, and technical solutions...">${escapeHtml(this.candidateAnswer)}</textarea>

              <div class="vib-actions">
                <button class="btn btn-outline" id="view-defense-strategy-btn">
                  <i class="fa-solid fa-shield-halved text-accent"></i> View Model Defense Strategy
                </button>
                <button class="btn btn-success" id="evaluate-viva-btn">
                  Evaluate Viva Defense <i class="fa-solid fa-check"></i>
                </button>
              </div>

              <!-- Defense Strategy Drawer -->
              <div id="defense-strategy-drawer" class="defense-drawer" style="display: none;">
                <div class="drawer-header">
                  <h4><i class="fa-solid fa-lightbulb text-warning"></i> Recommended Defense Framework</h4>
                  <button class="btn-close-drawer" id="close-drawer-btn">&times;</button>
                </div>
                <p>${escapeHtml(probe.defenseStrategy)}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Project Modal -->
        <div class="modal-backdrop" id="add-project-modal" style="display: none;">
          <div class="modal-dialog">
            <div class="modal-header">
              <h3><i class="fa-solid fa-folder-plus text-accent"></i> Add Your College Project</h3>
              <button class="btn-close-modal" id="close-proj-modal-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Project Title / Name *</label>
                <input type="text" id="new-proj-title" class="form-control" placeholder="e.g. Campus Smart Attendance System">
              </div>
              <div class="form-group">
                <label>Tech Stack & Frameworks *</label>
                <input type="text" id="new-proj-stack" class="form-control" placeholder="e.g. React, Node.js, Express, OpenCV, Python">
              </div>
              <div class="form-group">
                <label>Database / Cloud Services</label>
                <input type="text" id="new-proj-db" class="form-control" placeholder="e.g. PostgreSQL, Redis, AWS S3">
              </div>
              <div class="form-group">
                <label>Brief Description & Features</label>
                <textarea id="new-proj-desc" class="form-control" rows="3" placeholder="Briefly describe what problem this project solves and your personal contribution..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" id="cancel-proj-modal-btn">Cancel</button>
              <button class="btn btn-primary" id="save-new-proj-btn">Generate Viva Defense Plan</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Project pills
    this.container.querySelectorAll('.project-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = e.currentTarget.getAttribute('data-proj-title');
        const found = this.getAllProjects().find(p => p.title === title);
        if (found) this.loadActiveProject(found);
      });
    });

    // Probe items
    this.container.querySelectorAll('.probe-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-probe-idx'), 10);
        this.activeProbeIndex = idx;
        this.candidateAnswer = '';
        this.render();
      });
    });

    // TTS
    const ttsBtn = document.getElementById('viva-tts-btn');
    if (ttsBtn) {
      ttsBtn.addEventListener('click', () => {
        const probe = this.generatedProbes[this.activeProbeIndex];
        if (speechController.isSpeaking) {
          speechController.stopSpeaking();
          ttsBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
        } else {
          ttsBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop';
          speechController.speak(probe.question, () => {}, () => {
            ttsBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
          });
        }
      });
    }

    // Mic
    const micBtn = document.getElementById('viva-mic-btn');
    const textarea = document.getElementById('viva-textarea');
    if (micBtn && textarea) {
      micBtn.addEventListener('click', () => {
        if (this.isRecording) {
          speechController.stopListening();
          this.isRecording = false;
          micBtn.classList.remove('recording');
          micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> <span>Speak Defense (Mic)</span>';
        } else {
          const success = speechController.startListening(
            (finalT) => {
              textarea.value = (textarea.value ? textarea.value + ' ' : '') + finalT;
              this.candidateAnswer = textarea.value;
            },
            (err) => {
              showToast(`Mic error: ${err}`, 'warning');
              this.isRecording = false;
              micBtn.classList.remove('recording');
            },
            () => {
              this.isRecording = false;
              micBtn.classList.remove('recording');
              micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> <span>Speak Defense (Mic)</span>';
            }
          );
          if (success) {
            this.isRecording = true;
            micBtn.classList.add('recording');
            micBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i> <span>Listening...</span>';
          }
        }
      });

      textarea.addEventListener('input', (e) => {
        this.candidateAnswer = e.target.value;
      });
    }

    // Defense strategy drawer toggle
    const strategyBtn = document.getElementById('view-defense-strategy-btn');
    const drawer = document.getElementById('defense-strategy-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    if (strategyBtn && drawer) {
      strategyBtn.addEventListener('click', () => {
        drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
      });
    }
    if (closeDrawerBtn && drawer) {
      closeDrawerBtn.addEventListener('click', () => {
        drawer.style.display = 'none';
      });
    }

    // Evaluate viva button
    const evalBtn = document.getElementById('evaluate-viva-btn');
    if (evalBtn) {
      evalBtn.addEventListener('click', async () => {
        const text = this.candidateAnswer.trim();
        if (text.length < 15) {
          showToast('Please provide an explanation for your project viva defense before evaluating.', 'warning');
          return;
        }

        const probe = this.generatedProbes[this.activeProbeIndex];
        evalBtn.disabled = true;
        evalBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Grading Viva...';

        try {
          const evalResult = await aiService.evaluateAnswer({
            question: probe.question,
            answer: text,
            category: 'Viva',
            rubric: { expectedTerms: probe.keyTerms, strategy: probe.defenseStrategy }
          });

          appState.recordAnswer('Project Viva: ' + probe.topic, evalResult.score >= 60);

          // Render feedback in modal
          this.showVivaFeedbackModal(evalResult, probe);
        } catch (err) {
          showToast(`Evaluation failed: ${err.message}`, 'error');
        } finally {
          evalBtn.disabled = false;
          evalBtn.innerHTML = 'Evaluate Viva Defense <i class="fa-solid fa-check"></i>';
        }
      });
    }

    // Add Custom Project Modal
    const addBtn = document.getElementById('add-custom-proj-btn');
    const modal = document.getElementById('add-project-modal');
    const closeModalBtn = document.getElementById('close-proj-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-proj-modal-btn');
    const saveProjBtn = document.getElementById('save-new-proj-btn');

    if (addBtn && modal) {
      addBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
      });
    }

    const closeModal = () => {
      if (modal) modal.style.display = 'none';
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    if (saveProjBtn) {
      saveProjBtn.addEventListener('click', () => {
        const title = document.getElementById('new-proj-title')?.value.trim();
        const stack = document.getElementById('new-proj-stack')?.value.trim();
        const db = document.getElementById('new-proj-db')?.value.trim();
        const desc = document.getElementById('new-proj-desc')?.value.trim();

        if (!title || !stack) {
          showToast('Please provide at least a Project Title and Tech Stack.', 'warning');
          return;
        }

        const newProject = {
          title,
          techStack: stack,
          database: db || 'Custom Database',
          description: desc || 'Custom student capstone project.'
        };

        appState.saveProject(newProject);
        showToast(`Project "${title}" added to Viva Defense Studio!`, 'success');
        closeModal();
        this.loadActiveProject(newProject);
      });
    }
  }

  showVivaFeedbackModal(evalResult, probe) {
    const existing = document.getElementById('viva-eval-modal');
    if (existing) existing.remove();

    const modalEl = document.createElement('div');
    modalEl.id = 'viva-eval-modal';
    modalEl.className = 'evaluation-overlay';
    modalEl.style.display = 'flex';

    const scoreColor = evalResult.score >= 80 ? '#10b981' : evalResult.score >= 60 ? '#3b82f6' : '#ef4444';

    modalEl.innerHTML = `
      <div class="evaluation-modal">
        <div class="eval-result-header">
          <div class="eval-score-ring" style="border-color: ${scoreColor}">
            <span class="score-number" style="color: ${scoreColor}">${evalResult.score}</span>
            <span class="score-label">/ 100</span>
          </div>
          <div class="eval-header-meta">
            <span class="rating-badge" style="background: ${scoreColor}20; color: ${scoreColor}">
              ${escapeHtml(evalResult.rating)}
            </span>
            <h3>Viva Defense Assessment</h3>
            <p class="text-muted">Topic: ${escapeHtml(probe.topic)}</p>
          </div>
          <button class="modal-close-btn" id="close-viva-modal-x">&times;</button>
        </div>

        <div class="eval-result-body">
          <div class="eval-columns">
            <div class="eval-col strengths-col">
              <h4><i class="fa-solid fa-circle-check text-success"></i> What You Did Well</h4>
              <ul>
                ${evalResult.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
              </ul>
            </div>
            <div class="eval-col improvements-col">
              <h4><i class="fa-solid fa-triangle-exclamation text-warning"></i> What Needs Polish</h4>
              <ul>
                ${evalResult.improvements.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="eval-followup-card">
            <div class="followup-title">
              <i class="fa-solid fa-shield-halved text-accent"></i> <strong>Interviewer Follow-Up Grilling:</strong>
            </div>
            <p class="followup-text">"${escapeHtml(evalResult.followUp)}"</p>
          </div>
        </div>

        <div class="eval-result-footer">
          <button class="btn btn-primary" id="viva-modal-done-btn">Continue Viva Drill</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    const close = () => modalEl.remove();
    document.getElementById('close-viva-modal-x')?.addEventListener('click', close);
    document.getElementById('viva-modal-done-btn')?.addEventListener('click', () => {
      close();
      if (this.activeProbeIndex < this.generatedProbes.length - 1) {
        this.activeProbeIndex++;
        this.candidateAnswer = '';
        this.render();
      }
    });
  }
}
