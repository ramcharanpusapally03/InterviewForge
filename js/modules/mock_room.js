// Mock Interview Room: Immersive split-screen practice with Web Speech & AI grading
import { HR_QUESTIONS } from '../data/questions_hr.js';
import { TECHNICAL_QUESTIONS } from '../data/questions_technical.js';
import { speechController } from '../utils/speech.js';
import { aiService } from './ai_service.js';
import { appState } from '../state.js';
import { formatTime, showToast, escapeHtml } from '../utils/helpers.js';

export class MockRoom {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentCategory = 'Technical';
    this.currentQuestion = null;
    this.isRecording = false;
    this.answerText = '';
    this.timerSeconds = 180; // 3 minutes default answer timer
    this.timerInterval = null;
    this.isEvaluating = false;
  }

  init() {
    this.renderRoom();
  }

  getPoolQuestions(category) {
    if (category === 'Frontend & UI') {
      const fe = TECHNICAL_QUESTIONS.filter(q => q.category === 'Frontend & Web' || q.companyTags.includes('frontend_track'));
      return fe.length > 0 ? fe : TECHNICAL_QUESTIONS;
    }
    if (category === 'Data Analytics') {
      const da = TECHNICAL_QUESTIONS.filter(q => q.category === 'Data Analytics' || q.companyTags.includes('data_analyst_track'));
      return da.length > 0 ? da : TECHNICAL_QUESTIONS;
    }
    if (category === 'Cybersecurity') {
      const sec = TECHNICAL_QUESTIONS.filter(q => q.category === 'Cybersecurity' || q.companyTags.includes('cyber_track'));
      return sec.length > 0 ? sec : TECHNICAL_QUESTIONS;
    }
    if (category === 'Everyday Workplace') {
      const daily = HR_QUESTIONS.filter(q => q.category.includes('Workplace') || q.category.includes('Communication'));
      return daily.length > 0 ? daily : HR_QUESTIONS;
    }
    if (category === 'HR & Behavioral') {
      return HR_QUESTIONS;
    }
    return TECHNICAL_QUESTIONS;
  }

  pickRandomQuestion(category) {
    const pool = this.getPoolQuestions(category);
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex] || TECHNICAL_QUESTIONS[0];
  }

  renderRoom() {
    if (!this.container) return;

    if (!this.currentQuestion) {
      this.currentQuestion = this.pickRandomQuestion(this.currentCategory);
    }

    const isHR = this.currentCategory === 'HR & Behavioral' || this.currentCategory === 'Everyday Workplace';

    this.container.innerHTML = `
      <div class="mock-room-wrapper">
        <!-- Room Control Topbar -->
        <div class="mock-topbar">
          <div class="mock-role-selector">
            <span class="label-text"><i class="fa-solid fa-headset text-accent"></i> Interview Track:</span>
            <select class="form-select" id="mock-category-select">
              <option value="Frontend & UI" ${this.currentCategory === 'Frontend & UI' ? 'selected' : ''}>Frontend Developer (React, JS, Web UI)</option>
              <option value="Data Analytics" ${this.currentCategory === 'Data Analytics' ? 'selected' : ''}>Data Analyst (SQL, EDA, Metrics)</option>
              <option value="Cybersecurity" ${this.currentCategory === 'Cybersecurity' ? 'selected' : ''}>Cybersecurity (OWASP, Networks, AppSec)</option>
              <option value="Technical" ${this.currentCategory === 'Technical' ? 'selected' : ''}>Software Engineer (Core CS, DSA, OOPs)</option>
              <option value="Everyday Workplace" ${this.currentCategory === 'Everyday Workplace' ? 'selected' : ''}>Everyday Workplace (Standups, Deadlines, Incidents)</option>
              <option value="HR & Behavioral" ${this.currentCategory === 'HR & Behavioral' ? 'selected' : ''}>HR & Behavioral (STAR Framework)</option>
            </select>
            <button class="btn btn-outline btn-sm" id="next-random-q-btn">
              <i class="fa-solid fa-shuffle"></i> Next Question
            </button>
          </div>

          <div class="mock-timer-box">
            <i class="fa-solid fa-stopwatch"></i>
            <span id="mock-timer-digits">${formatTime(this.timerSeconds)}</span>
            <button class="btn btn-ghost btn-sm" id="reset-timer-btn" title="Reset 3-minute timer">
              <i class="fa-solid fa-rotate-left"></i>
            </button>
          </div>
        </div>

        <!-- Split Screen Arena -->
        <div class="mock-split-grid">
          <!-- Left: Interviewer Stage -->
          <div class="mock-interviewer-pane">
            <div class="avatar-card">
              <div class="avatar-circle" id="interviewer-avatar">
                <i class="fa-solid fa-user-tie"></i>
                <div class="audio-waves" id="audio-wave-anim">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
              </div>
              <div class="avatar-meta">
                <h4>Senior Technical Lead</h4>
                <span class="avatar-status"><span class="pulse-green"></span> Live Session</span>
              </div>
            </div>

            <div class="interviewer-prompt-card">
              <div class="prompt-header">
                <span class="badge badge-accent">${escapeHtml(this.currentCategory)}</span>
                <span class="badge badge-topic">${escapeHtml(this.currentQuestion.topic || 'Assessment')}</span>
                <button class="btn btn-primary btn-sm btn-tts" id="read-question-tts-btn" title="Listen to question">
                  <i class="fa-solid fa-volume-high"></i> Listen
                </button>
              </div>

              <div class="prompt-text" id="interviewer-question-text">
                "${escapeHtml(this.currentQuestion.question)}"
              </div>

              <!-- STAR Framework or Technical Guidance Accordion -->
              <div class="framework-guide-card">
                <div class="guide-header" id="toggle-guide-btn">
                  <span><i class="fa-solid fa-compass text-accent"></i> ${isHR ? 'STAR Framework Guide' : 'Key Talking Points Guide'}</span>
                  <i class="fa-solid fa-chevron-down" id="guide-chevron"></i>
                </div>
                <div class="guide-content" id="guide-content" style="display: none;">
                  ${isHR ? `
                    <ul class="star-list">
                      <li><strong>Situation:</strong> Set the context and challenge you faced.</li>
                      <li><strong>Task:</strong> Your exact responsibility in that situation.</li>
                      <li><strong>Action:</strong> Specific technical and collaborative steps you took.</li>
                      <li><strong>Result:</strong> Quantifiable outcome, lessons learned, and impact.</li>
                    </ul>
                  ` : `
                    <p class="text-muted small">Mention data structures, time and space complexity ($O(n)$), edge cases, and architectural trade-offs to score maximum points.</p>
                  `}
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Candidate Answer Console -->
          <div class="mock-candidate-pane">
            <div class="candidate-header">
              <h4><i class="fa-solid fa-microphone-lines text-accent"></i> Your Response Console</h4>
              <div class="voice-controls">
                <button class="btn btn-mic ${this.isRecording ? 'recording' : ''}" id="toggle-mic-btn">
                  <i class="fa-solid ${this.isRecording ? 'fa-microphone-slash' : 'fa-microphone'}"></i>
                  <span>${this.isRecording ? 'Recording Live... (Click to Stop)' : 'Speak Answer (Mic)'}</span>
                </button>
              </div>
            </div>

            <div class="answer-editor-box">
              <textarea 
                id="mock-answer-textarea" 
                class="form-control mock-textarea" 
                placeholder="Type your response here, or click 'Speak Answer' to transcribe your voice in real time..."
              >${escapeHtml(this.answerText)}</textarea>
              
              <div class="editor-statusbar">
                <span id="word-count-badge">Words: 0</span>
                <span class="text-muted small"><i class="fa-solid fa-keyboard"></i> Markdown and plain text supported</span>
              </div>
            </div>

            <div class="candidate-footer">
              <button class="btn btn-outline" id="clear-answer-btn">
                <i class="fa-solid fa-trash-can"></i> Clear
              </button>
              <button class="btn btn-success btn-lg" id="evaluate-answer-btn">
                Submit for Evaluation <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Evaluation Results Modal / Drawer -->
        <div class="evaluation-overlay" id="eval-modal-overlay" style="display: none;">
          <div class="evaluation-modal" id="eval-modal-content">
            <!-- Injected dynamically on evaluation -->
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.startMockTimer();
  }

  bindEvents() {
    // Category select
    const catSelect = document.getElementById('mock-category-select');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        this.currentCategory = e.target.value;
        this.currentQuestion = this.pickRandomQuestion(this.currentCategory);
        this.answerText = '';
        this.resetTimer();
        this.renderRoom();
      });
    }

    // Shuffle next question
    const nextQBtn = document.getElementById('next-random-q-btn');
    if (nextQBtn) {
      nextQBtn.addEventListener('click', () => {
        this.currentQuestion = this.pickRandomQuestion(this.currentCategory);
        this.answerText = '';
        this.resetTimer();
        this.renderRoom();
      });
    }

    // TTS Read aloud
    const ttsBtn = document.getElementById('read-question-tts-btn');
    const avatar = document.getElementById('interviewer-avatar');
    if (ttsBtn) {
      ttsBtn.addEventListener('click', () => {
        if (speechController.isSpeaking) {
          speechController.stopSpeaking();
          avatar.classList.remove('speaking');
          ttsBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
        } else {
          ttsBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop';
          avatar.classList.add('speaking');
          speechController.speak(
            this.currentQuestion.question,
            () => avatar.classList.add('speaking'),
            () => {
              avatar.classList.remove('speaking');
              ttsBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
            }
          );
        }
      });
    }

    // Toggle guide accordion
    const guideToggle = document.getElementById('toggle-guide-btn');
    const guideContent = document.getElementById('guide-content');
    const guideChevron = document.getElementById('guide-chevron');
    if (guideToggle && guideContent) {
      guideToggle.addEventListener('click', () => {
        const isHidden = guideContent.style.display === 'none';
        guideContent.style.display = isHidden ? 'block' : 'none';
        guideChevron.className = isHidden ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
      });
    }

    // Answer text area and word count
    const textarea = document.getElementById('mock-answer-textarea');
    const wordCount = document.getElementById('word-count-badge');
    if (textarea) {
      textarea.addEventListener('input', (e) => {
        this.answerText = e.target.value;
        const words = this.answerText.trim() ? this.answerText.trim().split(/\s+/).length : 0;
        if (wordCount) wordCount.textContent = `Words: ${words}`;
      });
    }

    // Toggle Voice mic
    const micBtn = document.getElementById('toggle-mic-btn');
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        if (this.isRecording) {
          speechController.stopListening();
          this.isRecording = false;
          micBtn.classList.remove('recording');
          micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> <span>Speak Answer (Mic)</span>';
        } else {
          const success = speechController.startListening(
            (finalT, interimT) => {
              const current = textarea.value;
              textarea.value = (current ? current + ' ' : '') + finalT;
              this.answerText = textarea.value;
              const words = this.answerText.trim().split(/\s+/).length;
              if (wordCount) wordCount.textContent = `Words: ${words}`;
            },
            (err) => {
              showToast(`Mic error: ${err}`, 'warning');
              this.isRecording = false;
              micBtn.classList.remove('recording');
              micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> <span>Speak Answer (Mic)</span>';
            },
            () => {
              this.isRecording = false;
              micBtn.classList.remove('recording');
              micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> <span>Speak Answer (Mic)</span>';
            }
          );

          if (success) {
            this.isRecording = true;
            micBtn.classList.add('recording');
            micBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i> <span>Recording Live... (Click to Stop)</span>';
            showToast('Microphone activated. Speak your answer clearly.', 'info');
          }
        }
      });
    }

    // Clear Answer
    const clearBtn = document.getElementById('clear-answer-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear your response text?')) {
          this.answerText = '';
          if (textarea) textarea.value = '';
          if (wordCount) wordCount.textContent = 'Words: 0';
        }
      });
    }

    // Reset Timer
    const resetTimerBtn = document.getElementById('reset-timer-btn');
    if (resetTimerBtn) {
      resetTimerBtn.addEventListener('click', () => this.resetTimer());
    }

    // Evaluate Answer
    const evalBtn = document.getElementById('evaluate-answer-btn');
    if (evalBtn) {
      evalBtn.addEventListener('click', () => this.evaluateCurrentAnswer());
    }
  }

  startMockTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        const timerEl = document.getElementById('mock-timer-digits');
        if (timerEl) {
          timerEl.textContent = formatTime(this.timerSeconds);
          if (this.timerSeconds < 30) {
            timerEl.classList.add('text-danger', 'pulse-fast');
          }
        }
      }
    }, 1000);
  }

  resetTimer() {
    this.timerSeconds = 180;
    const timerEl = document.getElementById('mock-timer-digits');
    if (timerEl) {
      timerEl.textContent = formatTime(this.timerSeconds);
      timerEl.classList.remove('text-danger', 'pulse-fast');
    }
  }

  async evaluateCurrentAnswer() {
    const text = this.answerText.trim();
    if (text.length < 15) {
      showToast('Please type or record a substantive answer before requesting evaluation.', 'warning');
      return;
    }

    const overlay = document.getElementById('eval-modal-overlay');
    const modal = document.getElementById('eval-modal-content');
    if (!overlay || !modal) return;

    overlay.style.display = 'flex';
    modal.innerHTML = `
      <div class="eval-loading">
        <i class="fa-solid fa-spinner fa-spin text-accent text-3xl"></i>
        <h3>Analyzing Response...</h3>
        <p class="text-muted">Evaluating answer clarity, technical relevance, structure, and depth.</p>
      </div>
    `;

    try {
      const evaluation = await aiService.evaluateAnswer({
        question: this.currentQuestion.question,
        answer: text,
        category: this.currentCategory,
        rubric: this.currentQuestion.starGuide || {}
      });

      this.renderEvaluationModal(evaluation);

      // Record to stats
      appState.recordAnswer(this.currentQuestion.topic || 'Mock Room', evaluation.score >= 60);

    } catch (err) {
      modal.innerHTML = `
        <div class="eval-error">
          <i class="fa-solid fa-triangle-exclamation text-danger text-3xl"></i>
          <h3>Evaluation Error</h3>
          <p>${escapeHtml(err.message)}</p>
          <button class="btn btn-outline" onclick="document.getElementById('eval-modal-overlay').style.display='none'">Close</button>
        </div>
      `;
    }
  }

  renderEvaluationModal(evaluation) {
    const modal = document.getElementById('eval-modal-content');
    if (!modal) return;

    const scoreColor = evaluation.score >= 80 ? '#10b981' : evaluation.score >= 60 ? '#3b82f6' : '#ef4444';

    modal.innerHTML = `
      <div class="eval-result-header">
        <div class="eval-score-ring" style="border-color: ${scoreColor}">
          <span class="score-number" style="color: ${scoreColor}">${evaluation.score}</span>
          <span class="score-label">/ 100</span>
        </div>
        <div class="eval-header-meta">
          <span class="rating-badge" style="background: ${scoreColor}20; color: ${scoreColor}">
            ${escapeHtml(evaluation.rating)}
          </span>
          <h3>Interviewer Performance Report</h3>
          <p class="text-muted">Assessment based on enterprise hiring criteria & STAR depth.</p>
        </div>
        <button class="modal-close-btn" id="close-eval-modal-btn">&times;</button>
      </div>

      <div class="eval-result-body">
        <div class="eval-columns">
          <!-- Strengths -->
          <div class="eval-col strengths-col">
            <h4><i class="fa-solid fa-circle-check text-success"></i> Key Strengths</h4>
            <ul>
              ${evaluation.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
            </ul>
          </div>

          <!-- Improvements -->
          <div class="eval-col improvements-col">
            <h4><i class="fa-solid fa-triangle-exclamation text-warning"></i> Suggestions for Improvement</h4>
            <ul>
              ${evaluation.improvements.map(imp => `<li>${escapeHtml(imp)}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Follow-up Question -->
        ${evaluation.followUp ? `
          <div class="eval-followup-card">
            <div class="followup-title">
              <i class="fa-solid fa-brain text-accent"></i> <strong>Interviewer Follow-Up Grilling Question:</strong>
            </div>
            <p class="followup-text">"${escapeHtml(evaluation.followUp)}"</p>
            <button class="btn btn-primary btn-sm" id="practice-followup-btn">
              <i class="fa-solid fa-reply"></i> Practice Answering This Follow-Up
            </button>
          </div>
        ` : ''}

        ${this.currentQuestion.sampleGoodAnswer ? `
          <div class="model-answer-accordion">
            <details>
              <summary><strong><i class="fa-solid fa-award text-accent"></i> View Model Benchmark Answer</strong></summary>
              <div class="model-answer-content">
                ${escapeHtml(this.currentQuestion.sampleGoodAnswer)}
              </div>
            </details>
          </div>
        ` : ''}
      </div>

      <div class="eval-result-footer">
        <button class="btn btn-primary" id="done-eval-btn">Done & Next Question</button>
      </div>
    `;

    document.getElementById('close-eval-modal-btn')?.addEventListener('click', () => {
      document.getElementById('eval-modal-overlay').style.display = 'none';
    });

    document.getElementById('done-eval-btn')?.addEventListener('click', () => {
      document.getElementById('eval-modal-overlay').style.display = 'none';
      this.currentQuestion = this.pickRandomQuestion(this.currentCategory);
      this.answerText = '';
      this.resetTimer();
      this.renderRoom();
    });

    document.getElementById('practice-followup-btn')?.addEventListener('click', () => {
      document.getElementById('eval-modal-overlay').style.display = 'none';
      this.currentQuestion = {
        question: evaluation.followUp,
        topic: 'Follow-Up Viva',
        category: this.currentCategory
      };
      this.answerText = '';
      this.resetTimer();
      this.renderRoom();
      showToast('Follow-up question loaded into the interview room.', 'info');
    });
  }
}
