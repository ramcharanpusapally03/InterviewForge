// Placement Mode Engine: Multi-round sequential campus simulation
import { COMPANY_TRACKS } from '../data/companies.js';
import { APTITUDE_QUESTIONS } from '../data/questions_aptitude.js';
import { TECHNICAL_QUESTIONS } from '../data/questions_technical.js';
import { HR_QUESTIONS } from '../data/questions_hr.js';
import { appState } from '../state.js';
import { formatTime, showToast, escapeHtml } from '../utils/helpers.js';

export class PlacementMode {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentTrack = COMPANY_TRACKS[0];
    this.currentRoundIndex = 0;
    this.currentQuestionIndex = 0;
    this.activeQuestions = [];
    this.userAnswers = {}; // { [qId]: selectedIndex or text }
    this.roundScores = [];
    this.timerInterval = null;
    this.secondsRemaining = 0;
    this.isReviewMode = false;
  }

  init() {
    this.renderTrackSelector();
  }

  renderTrackSelector() {
    if (!this.container) return;

    const tracksHtml = COMPANY_TRACKS.map(track => {
      const isSelected = track.id === this.currentTrack.id;
      return `
        <div class="company-card ${isSelected ? 'active-track' : ''}" data-track-id="${track.id}">
          <div class="company-card-header">
            <div class="company-icon" style="background: ${track.badgeColor}20; color: ${track.badgeColor}">
              <i class="${track.logo}"></i>
            </div>
            <span class="company-tag">${track.category}</span>
          </div>
          <h3 class="company-title">${escapeHtml(track.name)}</h3>
          <p class="company-desc">${escapeHtml(track.description)}</p>
          <div class="roles-pill-row">
            ${track.targetRoles.map(r => `<span class="role-pill">${escapeHtml(r)}</span>`).join('')}
          </div>
          <div class="track-meta-rounds">
            <span><i class="fa-solid fa-list-check"></i> ${track.rounds.length} Selection Rounds</span>
            <span><i class="fa-solid fa-bullseye"></i> Cutoff ~70%</span>
          </div>
          <button class="btn btn-primary btn-block select-track-btn" data-track-id="${track.id}">
            Start ${escapeHtml(track.name.split('(')[0].trim())} Drive
          </button>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="placement-arena-header">
        <div class="arena-title-group">
          <h2><i class="fa-solid fa-building-user text-accent"></i> Campus Placement Simulation Arena</h2>
          <p class="subtitle">Experience authentic multi-round placement recruitment drives for India's top IT and product companies. Clear the cutoffs round by round to earn placement qualification.</p>
        </div>
        <div class="beginner-mode-badge ${appState.state.settings.beginnerMode ? 'active' : ''}" id="toggle-beginner-btn">
          <i class="fa-solid fa-graduation-cap"></i>
          <span>Beginner Mode: ${appState.state.settings.beginnerMode ? 'ON (Instant Explanations)' : 'OFF (Exam Conditions)'}</span>
        </div>
      </div>
      <div class="company-tracks-grid">
        ${tracksHtml}
      </div>
    `;

    // Bind event listeners
    this.container.querySelectorAll('.select-track-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = e.currentTarget.getAttribute('data-track-id');
        this.selectTrack(trackId);
      });
    });

    const toggleBtn = document.getElementById('toggle-beginner-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const next = !appState.state.settings.beginnerMode;
        appState.updateSettings({ beginnerMode: next });
        showToast(`Beginner Mode ${next ? 'enabled: Detailed explanations shown after each question' : 'disabled: Timed exam mode'}`, 'info');
        this.renderTrackSelector();
      });
    }
  }

  selectTrack(trackId) {
    const found = COMPANY_TRACKS.find(t => t.id === trackId);
    if (!found) return;
    this.currentTrack = found;
    this.startDrive();
  }

  startDrive() {
    this.currentRoundIndex = 0;
    this.roundScores = [];
    this.loadRound(0);
  }

  loadRound(roundIdx) {
    this.currentRoundIndex = roundIdx;
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.isReviewMode = false;

    const round = this.currentTrack.rounds[roundIdx];
    this.secondsRemaining = round.durationMin * 60;

    // Filter questions appropriate for this round and company track
    if (round.type === 'aptitude') {
      const filtered = APTITUDE_QUESTIONS.filter(q => q.companyTags.includes(this.currentTrack.id));
      this.activeQuestions = (filtered.length >= 5 ? filtered : APTITUDE_QUESTIONS).slice(0, round.count);
    } else if (round.type === 'technical') {
      const filtered = TECHNICAL_QUESTIONS.filter(q => q.companyTags.includes(this.currentTrack.id));
      this.activeQuestions = (filtered.length >= 5 ? filtered : TECHNICAL_QUESTIONS).slice(0, round.count);
    } else if (round.type === 'viva') {
      // Technical viva questions
      this.activeQuestions = TECHNICAL_QUESTIONS.slice(0, round.count);
    } else {
      // HR questions
      this.activeQuestions = HR_QUESTIONS.slice(0, round.count);
    }

    this.startTimer();
    this.renderRoundInterface();
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.secondsRemaining--;
      const timerEl = document.getElementById('round-timer-display');
      if (timerEl) {
        timerEl.textContent = formatTime(this.secondsRemaining);
        if (this.secondsRemaining < 120) {
          timerEl.classList.add('text-danger', 'pulse-fast');
        }
      }
      if (this.secondsRemaining <= 0) {
        clearInterval(this.timerInterval);
        showToast('Time expired for this round! Submitting automatically.', 'warning');
        this.submitRound();
      }
    }, 1000);
  }

  renderRoundInterface() {
    const round = this.currentTrack.rounds[this.currentRoundIndex];
    const q = this.activeQuestions[this.currentQuestionIndex];
    if (!q) return;

    const totalQ = this.activeQuestions.length;
    const answeredCount = Object.keys(this.userAnswers).length;
    const isBookmarked = appState.isBookmarked(q.id);

    this.container.innerHTML = `
      <div class="active-round-container">
        <!-- Round Topbar -->
        <div class="round-topbar">
          <div class="round-title-box">
            <span class="track-badge" style="background: ${this.currentTrack.badgeColor}">
              ${escapeHtml(this.currentTrack.name.split('(')[0])}
            </span>
            <h3>${escapeHtml(round.name)}</h3>
            <span class="badge badge-outline">Round ${this.currentRoundIndex + 1} of ${this.currentTrack.rounds.length}</span>
          </div>

          <div class="round-status-box">
            <div class="timer-card">
              <i class="fa-solid fa-clock"></i>
              <span id="round-timer-display" class="timer-digits">${formatTime(this.secondsRemaining)}</span>
            </div>
            <button class="btn btn-outline btn-sm" id="quit-drive-btn" title="Exit to company selection">
              <i class="fa-solid fa-arrow-left"></i> Exit
            </button>
          </div>
        </div>

        <!-- Question Stepper Bar -->
        <div class="stepper-row">
          <div class="stepper-dots">
            ${this.activeQuestions.map((item, idx) => {
              const answered = this.userAnswers[item.id] !== undefined;
              const isCurrent = idx === this.currentQuestionIndex;
              let dotClass = 'step-dot';
              if (isCurrent) dotClass += ' step-active';
              else if (answered) dotClass += ' step-answered';
              return `<button class="${dotClass}" data-index="${idx}" title="Question ${idx + 1}">${idx + 1}</button>`;
            }).join('')}
          </div>
          <div class="stepper-count">
            <span>Progress: <strong>${answeredCount}/${totalQ}</strong> Answered</span>
          </div>
        </div>

        <!-- Question Main Card -->
        <div class="question-main-card">
          <div class="question-card-header">
            <div class="q-meta-tags">
              <span class="badge badge-primary">${escapeHtml(q.category || 'Placement')}</span>
              <span class="badge badge-topic">${escapeHtml(q.topic || 'Core')}</span>
              <span class="badge badge-difficulty ${q.difficulty?.toLowerCase()}">${escapeHtml(q.difficulty || 'Intermediate')}</span>
            </div>
            <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" id="bookmark-q-btn" title="Bookmark for revision">
              <i class="fa-${isBookmarked ? 'solid' : 'regular'} fa-bookmark"></i>
            </button>
          </div>

          <div class="question-body">
            <h4 class="q-number">Question ${this.currentQuestionIndex + 1}</h4>
            <div class="q-text">${escapeHtml(q.question).replace(/\n/g, '<br>')}</div>
          </div>

          <!-- Options or Input Area -->
          <div class="options-container" id="options-container">
            ${this.renderQuestionOptions(q)}
          </div>

          <!-- Beginner Mode Immediate Explanation (if answered & beginnerMode on) -->
          <div id="immediate-explanation-box"></div>

          <!-- Bottom Navigation Controls -->
          <div class="question-footer">
            <button class="btn btn-outline" id="prev-q-btn" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
              <i class="fa-solid fa-chevron-left"></i> Previous
            </button>

            <div class="footer-center">
              ${round.type === 'aptitude' || round.type === 'technical' ? `
                <span class="text-muted"><i class="fa-solid fa-circle-info"></i> Passing Cutoff: <strong>${round.cutoff}%</strong></span>
              ` : ''}
            </div>

            <div class="footer-actions">
              ${this.currentQuestionIndex === totalQ - 1 ? `
                <button class="btn btn-success" id="submit-round-btn">
                  Submit Round <i class="fa-solid fa-check"></i>
                </button>
              ` : `
                <button class="btn btn-primary" id="next-q-btn">
                  Next <i class="fa-solid fa-chevron-right"></i>
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindQuestionEvents(q);
  }

  renderQuestionOptions(q) {
    if (q.options) {
      const selected = this.userAnswers[q.id];
      return q.options.map((opt, i) => {
        let optClass = 'option-row';
        if (selected !== undefined) {
          if (selected === i) optClass += ' selected';
          if (appState.state.settings.beginnerMode && selected !== undefined) {
            if (i === q.correctIndex) optClass += ' option-correct';
            else if (selected === i && selected !== q.correctIndex) optClass += ' option-wrong';
          }
        }
        return `
          <div class="${optClass}" data-opt-idx="${i}">
            <div class="opt-indicator">${String.fromCharCode(65 + i)}</div>
            <div class="opt-label">${escapeHtml(opt)}</div>
            ${appState.state.settings.beginnerMode && selected !== undefined && i === q.correctIndex ? '<i class="fa-solid fa-check text-success opt-icon"></i>' : ''}
            ${appState.state.settings.beginnerMode && selected === i && i !== q.correctIndex ? '<i class="fa-solid fa-xmark text-danger opt-icon"></i>' : ''}
          </div>
        `;
      }).join('');
    } else {
      // Open-ended / HR / Viva response area
      const textVal = this.userAnswers[q.id] || '';
      return `
        <div class="subjective-response-box">
          <label class="form-label">Type your detailed answer or bullet points:</label>
          <textarea class="form-control" id="subjective-input" rows="5" placeholder="Structure your answer clearly...">${escapeHtml(textVal)}</textarea>
          <div class="textarea-hints">
            <span><i class="fa-solid fa-lightbulb"></i> Tip: Use the STAR method for behavioral answers or justify technical trade-offs.</span>
          </div>
        </div>
      `;
    }
  }

  bindQuestionEvents(q) {
    // Option clicks
    this.container.querySelectorAll('.option-row').forEach(row => {
      row.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-opt-idx'), 10);
        const wasAnswered = this.userAnswers[q.id] !== undefined;
        this.userAnswers[q.id] = idx;
        const isCorrect = idx === q.correctIndex;

        if (!wasAnswered) {
          appState.recordAnswer(q.topic || 'General', isCorrect);
        }

        // If beginner mode is ON, show instant explanation
        if (appState.state.settings.beginnerMode) {
          this.renderImmediateExplanation(q, isCorrect);
        }

        this.renderRoundInterface();
      });
    });

    // Subjective text input
    const subInput = document.getElementById('subjective-input');
    if (subInput) {
      subInput.addEventListener('input', (e) => {
        this.userAnswers[q.id] = e.target.value;
      });
    }

    // Prev / Next
    const prevBtn = document.getElementById('prev-q-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentQuestionIndex > 0) {
          this.currentQuestionIndex--;
          this.renderRoundInterface();
        }
      });
    }

    const nextBtn = document.getElementById('next-q-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentQuestionIndex < this.activeQuestions.length - 1) {
          this.currentQuestionIndex++;
          this.renderRoundInterface();
        }
      });
    }

    // Step dots
    this.container.querySelectorAll('.step-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        this.currentQuestionIndex = idx;
        this.renderRoundInterface();
      });
    });

    // Bookmark
    const bmarkBtn = document.getElementById('bookmark-q-btn');
    if (bmarkBtn) {
      bmarkBtn.addEventListener('click', () => {
        const bookmarked = appState.toggleBookmark(q.id);
        bmarkBtn.classList.toggle('bookmarked', bookmarked);
        bmarkBtn.innerHTML = `<i class="fa-${bookmarked ? 'solid' : 'regular'} fa-bookmark"></i>`;
        showToast(bookmarked ? 'Question bookmarked for revision' : 'Bookmark removed', 'info');
      });
    }

    // Exit Drive
    const quitBtn = document.getElementById('quit-drive-btn');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to exit this placement drive? Progress in current round will be lost.')) {
          clearInterval(this.timerInterval);
          this.renderTrackSelector();
        }
      });
    }

    // Submit Round
    const submitBtn = document.getElementById('submit-round-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const unanswered = this.activeQuestions.length - Object.keys(this.userAnswers).length;
        if (unanswered > 0) {
          if (!confirm(`You still have ${unanswered} unanswered question(s). Are you sure you want to submit?`)) {
            return;
          }
        }
        this.submitRound();
      });
    }

    // Render explanation if already answered and in beginner mode
    if (appState.state.settings.beginnerMode && this.userAnswers[q.id] !== undefined && q.explanation) {
      this.renderImmediateExplanation(q, this.userAnswers[q.id] === q.correctIndex);
    }
  }

  renderImmediateExplanation(q, isCorrect) {
    const box = document.getElementById('immediate-explanation-box');
    if (!box) return;

    box.innerHTML = `
      <div class="explanation-card ${isCorrect ? 'exp-correct' : 'exp-wrong'}">
        <div class="exp-header">
          <i class="fa-solid ${isCorrect ? 'fa-circle-check text-success' : 'fa-circle-xmark text-danger'}"></i>
          <strong>${isCorrect ? 'Correct Answer!' : 'Incorrect Choice'}</strong>
          <span class="exp-badge">Beginner Concept Guide</span>
        </div>
        <div class="exp-body">
          <p><strong>Step-by-step Solution:</strong></p>
          <div class="solution-text">${escapeHtml(q.explanation).replace(/\n/g, '<br>')}</div>
          ${q.tip ? `<div class="fresher-tip"><i class="fa-solid fa-wand-magic-sparkles text-accent"></i> <strong>Fresher Tip:</strong> ${escapeHtml(q.tip)}</div>` : ''}
        </div>
      </div>
    `;
  }

  submitRound() {
    clearInterval(this.timerInterval);
    const round = this.currentTrack.rounds[this.currentRoundIndex];

    let correctCount = 0;
    let totalQuestions = this.activeQuestions.length;

    this.activeQuestions.forEach(q => {
      const ans = this.userAnswers[q.id];
      if (q.options) {
        if (ans === q.correctIndex) correctCount++;
      } else {
        // Subjective: If answered with > 20 words, give credit in MVP
        if (ans && ans.trim().split(/\s+/).length > 20) {
          correctCount++;
        }
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= round.cutoff;

    this.roundScores.push({
      roundName: round.name,
      roundType: round.type,
      score: percentage,
      cutoff: round.cutoff,
      passed,
      correctCount,
      totalQuestions
    });

    this.renderRoundResult(passed, percentage, round);
  }

  renderRoundResult(passed, percentage, round) {
    const isFinalRound = this.currentRoundIndex === this.currentTrack.rounds.length - 1;

    this.container.innerHTML = `
      <div class="round-result-card text-center">
        <div class="result-icon-wrapper ${passed ? 'passed' : 'failed'}">
          <i class="fa-solid ${passed ? 'fa-award' : 'fa-triangle-exclamation'}"></i>
        </div>

        <h2>${passed ? 'Round Cleared!' : 'Cutoff Not Cleared'}</h2>
        <p class="subtitle">
          ${passed 
            ? `Outstanding performance! You cleared the ${round.cutoff}% threshold for <strong>${escapeHtml(round.name)}</strong>.`
            : `You scored ${percentage}%, but the cutoff for ${escapeHtml(this.currentTrack.name)} is ${round.cutoff}%. Practice your weak topics in the Weakness Clinic.`
          }
        </p>

        <div class="score-stat-grid">
          <div class="stat-box">
            <span class="stat-label">Your Score</span>
            <span class="stat-value ${passed ? 'text-success' : 'text-danger'}">${percentage}%</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Required Cutoff</span>
            <span class="stat-value text-accent">${round.cutoff}%</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Correct Answers</span>
            <span class="stat-value">${this.roundScores[this.currentRoundIndex].correctCount} / ${this.activeQuestions.length}</span>
          </div>
        </div>

        <div class="result-actions">
          ${passed && !isFinalRound ? `
            <button class="btn btn-primary btn-lg" id="proceed-next-round-btn">
              Proceed to Round ${this.currentRoundIndex + 2} <i class="fa-solid fa-arrow-right"></i>
            </button>
          ` : passed && isFinalRound ? `
            <button class="btn btn-success btn-lg" id="view-final-summary-btn">
              View Final Placement Offer & Report <i class="fa-solid fa-trophy"></i>
            </button>
          ` : `
            <button class="btn btn-outline btn-lg" id="retry-round-btn">
              <i class="fa-solid fa-rotate-left"></i> Retake This Round
            </button>
            <button class="btn btn-primary btn-lg" id="goto-weakness-btn">
              <i class="fa-solid fa-brain"></i> Open Weakness Clinic
            </button>
          `}
          <button class="btn btn-ghost" id="back-tracks-btn">Exit to Company Tracks</button>
        </div>
      </div>
    `;

    const proceedBtn = document.getElementById('proceed-next-round-btn');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        this.loadRound(this.currentRoundIndex + 1);
      });
    }

    const retryBtn = document.getElementById('retry-round-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.loadRound(this.currentRoundIndex);
      });
    }

    const finalSummaryBtn = document.getElementById('view-final-summary-btn');
    if (finalSummaryBtn) {
      finalSummaryBtn.addEventListener('click', () => {
        this.renderDriveCompletion();
      });
    }

    const backTracksBtn = document.getElementById('back-tracks-btn');
    if (backTracksBtn) {
      backTracksBtn.addEventListener('click', () => {
        this.renderTrackSelector();
      });
    }

    const gotoWeaknessBtn = document.getElementById('goto-weakness-btn');
    if (gotoWeaknessBtn) {
      gotoWeaknessBtn.addEventListener('click', () => {
        const tab = document.querySelector('[data-tab="weakness"]');
        if (tab) tab.click();
      });
    }
  }

  renderDriveCompletion() {
    const avgScore = Math.round(this.roundScores.reduce((acc, r) => acc + r.score, 0) / this.roundScores.length);
    const clearedAll = this.roundScores.every(r => r.passed);

    // Record session into state
    appState.recordSession({
      companyId: this.currentTrack.id,
      companyName: this.currentTrack.name,
      avgScore,
      clearedAllRounds: clearedAll,
      rounds: this.roundScores
    });

    this.container.innerHTML = `
      <div class="drive-summary-card">
        <div class="summary-badge-banner" style="background: linear-gradient(135deg, ${this.currentTrack.badgeColor}, #0f172a);">
          <div class="trophy-circle"><i class="fa-solid fa-trophy"></i></div>
          <h2>Placement Drive Completed!</h2>
          <p>Official Evaluation Report: <strong>${escapeHtml(this.currentTrack.name)}</strong></p>
        </div>

        <div class="summary-body">
          <div class="offer-status-box">
            <span class="status-pill status-verified"><i class="fa-solid fa-circle-check"></i> Qualified for Campus Offer</span>
            <h3>Eligible Roles: ${this.currentTrack.targetRoles.join(', ')}</h3>
            <p>Overall Drive Average Score: <strong class="text-accent text-xl">${avgScore}%</strong></p>
          </div>

          <div class="round-breakdown-table">
            <h4>Round Performance Breakdown:</h4>
            ${this.roundScores.map((r, i) => `
              <div class="round-score-row">
                <span class="r-name"><i class="fa-solid fa-check text-success"></i> ${escapeHtml(r.roundName)}</span>
                <span class="r-cutoff">Cutoff: ${r.cutoff}%</span>
                <span class="r-score"><strong>${r.score}%</strong></span>
              </div>
            `).join('')}
          </div>

          <div class="summary-actions">
            <button class="btn btn-primary btn-lg" id="finish-drive-btn">
              Back to Arena <i class="fa-solid fa-house"></i>
            </button>
            <button class="btn btn-outline btn-lg" id="open-analytics-btn">
              View Readiness Analytics <i class="fa-solid fa-chart-line"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('finish-drive-btn')?.addEventListener('click', () => {
      this.renderTrackSelector();
    });

    document.getElementById('open-analytics-btn')?.addEventListener('click', () => {
      const tab = document.querySelector('[data-tab="dashboard"]');
      if (tab) tab.click();
    });
  }
}
