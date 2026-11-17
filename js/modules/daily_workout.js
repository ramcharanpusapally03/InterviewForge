// Daily Workout Module: 5-Minute Daily Practice Routine for Any Job Seeker
import { APTITUDE_QUESTIONS } from '../data/questions_aptitude.js';
import { TECHNICAL_QUESTIONS } from '../data/questions_technical.js';
import { HR_QUESTIONS } from '../data/questions_hr.js';
import { appState } from '../state.js';
import { showToast, escapeHtml } from '../utils/helpers.js';

export class DailyWorkout {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.todayQuestions = [];
    this.userAnswers = {};
    this.isCompletedToday = false;
  }

  init() {
    this.generateDailySet();
    this.render();
  }

  generateDailySet() {
    // Generate deterministic daily questions based on today's calendar date
    const todayStr = new Date().toISOString().split('T')[0];
    const seed = todayStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);

    const aptQ = APTITUDE_QUESTIONS[seed % APTITUDE_QUESTIONS.length];
    const techQ = TECHNICAL_QUESTIONS[(seed + 3) % TECHNICAL_QUESTIONS.length];
    const hrQ = HR_QUESTIONS[(seed + 5) % HR_QUESTIONS.length];

    this.todayQuestions = [
      { step: '01', type: 'Quantitative & Logic Warmup', ...aptQ },
      { step: '02', type: 'Core Technical Concept', ...techQ },
      { step: '03', type: 'Workplace Behavioral Scenario', ...hrQ }
    ];

    // Check if user already finished today's challenge
    const lastSession = appState.state.history.find(h => h.isDailyChallenge && h.dateStr === todayStr);
    this.isCompletedToday = !!lastSession;
  }

  render() {
    if (!this.container) return;

    const streak = appState.state.stats.streak || 1;
    const answeredCount = Object.keys(this.userAnswers).length;
    const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    this.container.innerHTML = `
      <div class="daily-workout-wrapper">
        <!-- Header -->
        <div class="daily-header">
          <div class="daily-title-group">
            <span class="badge badge-warning"><i class="fa-solid fa-calendar-day"></i> ${escapeHtml(todayFormatted)}</span>
            <h2><i class="fa-solid fa-mug-hot text-accent"></i> 5-Minute Daily Interview Workout</h2>
            <p class="subtitle">Consistency beats cramming. Solve 3 high-yield questions every morning to sharpen your problem solving, technical fluency, and workplace communication.</p>
          </div>

          <div class="streak-flame-card">
            <div class="flame-icon"><i class="fa-solid fa-fire"></i></div>
            <div class="flame-info">
              <span class="flame-count">${streak} Day${streak > 1 ? 's' : ''}</span>
              <span class="flame-label">Daily Streak</span>
            </div>
          </div>
        </div>

        <!-- Progress Pills -->
        <div class="workout-progress-bar-card">
          <div class="wpb-info">
            <span><strong>Today's Routine:</strong> 1 Logic Warmup + 1 Technical Concept + 1 Workplace Scenario</span>
            <span class="badge ${this.isCompletedToday ? 'badge-success' : 'badge-primary'}">
              ${this.isCompletedToday ? 'Completed Today!' : `${answeredCount}/3 Completed`}
            </span>
          </div>
          <div class="wc-progress-bar" style="margin-top: 0.75rem;">
            <div class="wc-progress-fill ${this.isCompletedToday ? 'mastered' : 'moderate'}" style="width: ${this.isCompletedToday ? 100 : (answeredCount / 3) * 100}%"></div>
          </div>
        </div>

        <!-- 3 Questions Cards -->
        <div class="daily-questions-flow">
          ${this.todayQuestions.map((q, idx) => this.renderDailyQuestionCard(q, idx)).join('')}
        </div>

        <!-- Submit Daily Button -->
        <div class="daily-submit-bar text-center">
          ${this.isCompletedToday ? `
            <div class="daily-done-alert">
              <i class="fa-solid fa-circle-check text-success text-2xl"></i>
              <h4>You crushed today's workout!</h4>
              <p class="text-muted">Come back tomorrow for your next daily set, or take a full test drive in the <strong>Placement Arena</strong>.</p>
            </div>
          ` : `
            <button class="btn btn-success btn-lg" id="submit-daily-workout-btn">
              Complete Today's Workout <i class="fa-solid fa-trophy"></i>
            </button>
          `}
        </div>

        <!-- Everyday Practice Presets for Any Candidate -->
        <div class="practice-presets-section">
          <h4><i class="fa-solid fa-bolt text-warning"></i> Quick Practice Routines for Busy Days</h4>
          <div class="preset-cards-grid">
            <div class="routine-card" data-routine="lunchtime">
              <div class="rc-icon" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6;"><i class="fa-solid fa-stopwatch-20"></i></div>
              <h5>10-Minute Lunchtime Blitz</h5>
              <p class="small text-muted">Rapid-fire technical MCQs and pseudocode tracing during breaks.</p>
              <button class="btn btn-outline btn-sm launch-routine-btn" data-target="mock" data-track="Technical">Start Blitz</button>
            </div>

            <div class="routine-card" data-routine="standup">
              <div class="rc-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;"><i class="fa-solid fa-people-arrows"></i></div>
              <h5>Morning Standup Drill</h5>
              <p class="small text-muted">Practice articulating your tasks, blockers, and tech decisions using your mic.</p>
              <button class="btn btn-outline btn-sm launch-routine-btn" data-target="mock" data-track="Everyday Workplace">Practice Speech</button>
            </div>

            <div class="routine-card" data-routine="viva">
              <div class="rc-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;"><i class="fa-solid fa-shield-halved"></i></div>
              <h5>5-Minute Project Defense</h5>
              <p class="small text-muted">Defend one architectural trade-off on your portfolio project.</p>
              <button class="btn btn-outline btn-sm launch-routine-btn" data-target="viva">Defend Project</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderDailyQuestionCard(q, idx) {
    const isAnswered = this.userAnswers[q.id] !== undefined;
    const selected = this.userAnswers[q.id];

    return `
      <div class="daily-q-card ${isAnswered ? 'card-answered' : ''}">
        <div class="dqc-header">
          <div class="dqc-step">Step ${q.step}</div>
          <span class="badge badge-accent">${escapeHtml(q.type)}</span>
          <span class="badge badge-topic">${escapeHtml(q.topic || 'General')}</span>
          ${isAnswered ? '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Answered</span>' : ''}
        </div>

        <div class="dqc-question">
          <h4>${escapeHtml(q.question).replace(/\n/g, '<br>')}</h4>
        </div>

        <div class="dqc-body">
          ${q.options ? `
            <div class="daily-options-grid">
              ${q.options.map((opt, oIdx) => {
                let optClass = 'daily-opt-pill';
                if (selected === oIdx) optClass += ' selected';
                if (isAnswered && oIdx === q.correctIndex) optClass += ' opt-correct';
                if (isAnswered && selected === oIdx && oIdx !== q.correctIndex) optClass += ' opt-wrong';

                return `
                  <button class="${optClass}" data-qid="${escapeHtml(q.id)}" data-opt="${oIdx}" ${isAnswered ? 'disabled' : ''}>
                    <span class="opt-alpha">${String.fromCharCode(65 + oIdx)}</span>
                    <span class="opt-content">${escapeHtml(opt)}</span>
                  </button>
                `;
              }).join('')}
            </div>
            ${isAnswered && q.explanation ? `
              <div class="daily-explanation">
                <strong><i class="fa-solid fa-lightbulb text-warning"></i> Solution Breakdown:</strong>
                <p class="small">${escapeHtml(q.explanation).replace(/\n/g, '<br>')}</p>
              </div>
            ` : ''}
          ` : `
            <div class="daily-text-response">
              <textarea class="form-control" rows="3" placeholder="Structure your bullet points (STAR method)..." id="daily-text-${escapeHtml(q.id)}">${escapeHtml(selected || '')}</textarea>
              <div class="text-end" style="margin-top: 0.5rem;">
                <button class="btn btn-outline btn-sm save-daily-text-btn" data-qid="${escapeHtml(q.id)}">Save Answer</button>
              </div>
            </div>
          `}
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Option clicks
    this.container.querySelectorAll('.daily-opt-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qId = e.currentTarget.getAttribute('data-qid');
        const opt = parseInt(e.currentTarget.getAttribute('data-opt'), 10);
        this.userAnswers[qId] = opt;

        const q = this.todayQuestions.find(item => item.id === qId);
        if (q) {
          appState.recordAnswer(q.topic || 'Daily Workout', opt === q.correctIndex);
        }

        this.render();
      });
    });

    // Subjective text save
    this.container.querySelectorAll('.save-daily-text-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qId = e.currentTarget.getAttribute('data-qid');
        const textarea = document.getElementById(`daily-text-${qId}`);
        if (textarea && textarea.value.trim()) {
          this.userAnswers[qId] = textarea.value.trim();
          showToast('Answer recorded for daily workout!', 'success');
          this.render();
        } else {
          showToast('Please type a response first.', 'warning');
        }
      });
    });

    // Complete Today's Workout
    const submitBtn = document.getElementById('submit-daily-workout-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const answered = Object.keys(this.userAnswers).length;
        if (answered < 2) {
          showToast('Please answer at least 2 questions to finish your daily workout.', 'warning');
          return;
        }

        const todayStr = new Date().toISOString().split('T')[0];
        appState.recordSession({
          isDailyChallenge: true,
          dateStr: todayStr,
          companyName: 'Daily 5-Min Workout',
          avgScore: 100,
          clearedAllRounds: true
        });

        this.isCompletedToday = true;
        showToast('Daily workout completed! Your practice streak has been updated.', 'success');
        this.render();
      });
    }

    // Quick routines launcher
    this.container.querySelectorAll('.launch-routine-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.getAttribute('data-target');
        const track = e.currentTarget.getAttribute('data-track');

        if (window.app && typeof window.app.switchTab === 'function') {
          window.app.switchTab(targetTab);
          if (track && window.app.modules.mock) {
            window.app.modules.mock.currentCategory = track;
            window.app.modules.mock.renderRoom();
          }
        }
      });
    });
  }
}
