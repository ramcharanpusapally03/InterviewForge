// Analytics & Progress Dashboard: Placement Readiness Index, Streaks, and Session Logs
import { appState } from '../state.js';
import { calculateReadinessIndex, downloadJSON, showToast, escapeHtml } from '../utils/helpers.js';

export class AnalyticsDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    const stats = appState.state.stats;
    const history = appState.state.history || [];
    const readiness = calculateReadinessIndex(stats);
    const accuracy = stats.totalAttempted > 0 ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100) : 0;

    this.container.innerHTML = `
      <div class="analytics-dashboard-wrapper">
        <div class="dashboard-header">
          <div>
            <h2><i class="fa-solid fa-chart-line text-accent"></i> Placement Readiness & Progress Tracker</h2>
            <p class="subtitle">Real-time metrics tracking your preparation volume, speed, accuracy, and campus placement qualification probability.</p>
          </div>
          <div class="header-backup-controls">
            <button class="btn btn-outline btn-sm" id="export-data-btn">
              <i class="fa-solid fa-download"></i> Export Progress (JSON)
            </button>
            <label class="btn btn-outline btn-sm" style="cursor: pointer;">
              <i class="fa-solid fa-upload"></i> Import Progress
              <input type="file" id="import-data-input" accept=".json" style="display: none;">
            </label>
          </div>
        </div>

        <!-- Hero Readiness Index Card -->
        <div class="readiness-hero-card">
          <div class="readiness-gauge-box">
            <div class="readiness-circle" style="border-color: ${readiness.color}">
              <span class="readiness-number" style="color: ${readiness.color}">${readiness.score}</span>
              <span class="readiness-unit">/ 100</span>
            </div>
            <div class="readiness-meta">
              <span class="readiness-tier-badge" style="background: ${readiness.color}20; color: ${readiness.color}">
                ${escapeHtml(readiness.tier)}
              </span>
              <h3>Campus Placement Readiness Index</h3>
              <p class="text-muted">Calculated from total question drills, multi-round cutoffs cleared, and consistency streaks.</p>
            </div>
          </div>

          <div class="readiness-badges-row">
            <div class="company-badge-item ${readiness.score >= 50 ? 'unlocked' : 'locked'}">
              <i class="fa-solid fa-building-columns"></i>
              <span>Ninja / Standard Track</span>
              <span class="badge-status">${readiness.score >= 50 ? 'Unlocked' : '50+ Pts Required'}</span>
            </div>
            <div class="company-badge-item ${readiness.score >= 70 ? 'unlocked' : 'locked'}">
              <i class="fa-solid fa-laptop-code"></i>
              <span>Digital / Specialist Track</span>
              <span class="badge-status">${readiness.score >= 70 ? 'Unlocked' : '70+ Pts Required'}</span>
            </div>
            <div class="company-badge-item ${readiness.score >= 85 ? 'unlocked' : 'locked'}">
              <i class="fa-solid fa-rocket"></i>
              <span>Prime / SDE-1 Tier</span>
              <span class="badge-status">${readiness.score >= 85 ? 'Unlocked' : '85+ Pts Required'}</span>
            </div>
          </div>
        </div>

        <!-- 4 Stats Cards Grid -->
        <div class="dashboard-stats-grid">
          <div class="stat-card">
            <div class="stat-icon-wrapper icon-streak"><i class="fa-solid fa-fire"></i></div>
            <div class="stat-info">
              <span class="stat-title">Daily Practice Streak</span>
              <span class="stat-metric">${stats.streak || 1} Days</span>
              <span class="stat-sub">Keep practicing daily to maintain!</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper icon-questions"><i class="fa-solid fa-list-check"></i></div>
            <div class="stat-info">
              <span class="stat-title">Questions Practiced</span>
              <span class="stat-metric">${stats.totalAttempted}</span>
              <span class="stat-sub">${stats.totalCorrect} Correct answers</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper icon-accuracy"><i class="fa-solid fa-bullseye"></i></div>
            <div class="stat-info">
              <span class="stat-title">Overall Accuracy</span>
              <span class="stat-metric ${accuracy >= 70 ? 'text-success' : 'text-accent'}">${accuracy}%</span>
              <span class="stat-sub">Across aptitude & technical rounds</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper icon-cleared"><i class="fa-solid fa-award"></i></div>
            <div class="stat-info">
              <span class="stat-title">Full Drives Qualified</span>
              <span class="stat-metric text-success">${stats.roundsCleared || 0}</span>
              <span class="stat-sub">All rounds cleared</span>
            </div>
          </div>
        </div>

        <!-- Completed Placement Sessions Table -->
        <div class="session-history-card">
          <div class="sh-header">
            <h4><i class="fa-solid fa-clock-rotate-left text-accent"></i> Recent Placement Drive History</h4>
            <span class="badge badge-outline">${history.length} Sessions Logged</span>
          </div>

          ${history.length === 0 ? `
            <div class="empty-history-box text-center">
              <p class="text-muted">No completed placement sessions yet. Head over to the Placement Arena to start your first full simulation!</p>
            </div>
          ` : `
            <div class="table-responsive">
              <table class="history-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Company Drive</th>
                    <th>Average Score</th>
                    <th>Result</th>
                    <th>Rounds Cleared</th>
                  </tr>
                </thead>
                <tbody>
                  ${history.map(s => `
                    <tr>
                      <td>${escapeHtml(s.date)}</td>
                      <td><strong>${escapeHtml(s.companyName)}</strong></td>
                      <td><span class="badge ${s.avgScore >= 70 ? 'badge-success' : 'badge-warning'}">${s.avgScore}%</span></td>
                      <td>
                        <span class="status-pill ${s.clearedAllRounds ? 'status-verified' : 'status-failed'}">
                          <i class="fa-solid ${s.clearedAllRounds ? 'fa-check' : 'fa-xmark'}"></i>
                          ${s.clearedAllRounds ? 'Qualified' : 'Cutoff Missed'}
                        </span>
                      </td>
                      <td>${s.rounds ? s.rounds.filter(r => r.passed).length + '/' + s.rounds.length : 'Completed'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- Danger Zone -->
        <div class="danger-zone-box">
          <div>
            <h5>Reset Preparation History</h5>
            <p class="small text-muted">Clears all logged scores, streaks, and weakness history from your local browser storage.</p>
          </div>
          <button class="btn btn-outline-danger btn-sm" id="reset-all-data-btn">
            <i class="fa-solid fa-trash-can"></i> Reset All Data
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Export JSON
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        downloadJSON(`interviewforge_progress_${new Date().toISOString().split('T')[0]}.json`, appState.state);
        showToast('Progress exported as JSON file.', 'success');
      });
    }

    // Import JSON
    const importInput = document.getElementById('import-data-input');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            if (appState.importData(parsed)) {
              showToast('Progress restored successfully!', 'success');
              this.render();
            } else {
              showToast('Invalid progress backup file.', 'error');
            }
          } catch (err) {
            showToast('Failed to parse backup JSON file.', 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    // Reset All Data
    const resetBtn = document.getElementById('reset-all-data-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all InterviewForge data? This action cannot be undone.')) {
          appState.resetAllData();
          showToast('All data has been reset to defaults.', 'info');
          this.render();
        }
      });
    }
  }
}
