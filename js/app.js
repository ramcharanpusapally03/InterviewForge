// InterviewForge Master Application Controller
import { appState } from './state.js';
import { PlacementMode } from './modules/placement_mode.js';
import { MockRoom } from './modules/mock_room.js';
import { ProjectVivaTrainer } from './modules/project_viva.js';
import { WeaknessDetector } from './modules/weakness_detector.js';
import { ResumeMatcher } from './modules/resume_matcher.js';
import { AnalyticsDashboard } from './modules/analytics.js';
import { DailyWorkout } from './modules/daily_workout.js';
import { OnboardingAnalyzer } from './modules/onboarding_analyzer.js';
import { speechController } from './utils/speech.js';
import { showToast, escapeHtml } from './utils/helpers.js';

class InterviewForgeApp {
  constructor() {
    this.currentTab = 'daily';
    this.modules = {};
    this.analyzer = null;
  }

  init() {
    this.applyTheme(appState.state.settings.theme);
    this.initModules();
    this.initAnalyzer();
    this.bindGlobalNavigation();
    this.bindSettingsModal();
    this.bindThemeToggle();

    // Re-render active module when tab switches
    this.switchTab('daily');
    console.log('InterviewForge platform initialized successfully.');
  }

  initAnalyzer() {
    this.analyzer = new OnboardingAnalyzer('onboarding-modal');
    this.analyzer.init();

    const openBtn = document.getElementById('open-analyzer-btn');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        this.analyzer.currentView = 'input';
        this.analyzer.show();
      });
    }

    const bannerAnalyzeBtn = document.getElementById('banner-analyze-cv-btn');
    if (bannerAnalyzeBtn) {
      bannerAnalyzeBtn.addEventListener('click', () => {
        this.analyzer.currentView = 'input';
        this.analyzer.show();
      });
    }

    const bannerManualBtn = document.getElementById('banner-manual-select-btn');
    if (bannerManualBtn) {
      bannerManualBtn.addEventListener('click', () => {
        this.analyzer.currentView = 'manual';
        this.analyzer.selectedTrackId = appState.state.user.targetCompany || 'product_sde1';
        this.analyzer.show();
      });
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('theme-toggle-icon');
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  initModules() {
    this.modules = {
      daily: new DailyWorkout('daily-view'),
      placement: new PlacementMode('placement-view'),
      mock: new MockRoom('mock-view'),
      viva: new ProjectVivaTrainer('viva-view'),
      weakness: new WeaknessDetector('weakness-view'),
      resume: new ResumeMatcher('resume-view'),
      dashboard: new AnalyticsDashboard('dashboard-view')
    };

    // Initialize modules
    Object.values(this.modules).forEach(mod => {
      try {
        mod.init();
      } catch (err) {
        console.error('Module init error:', err);
      }
    });

    // Update streak badge in topbar if present
    const streakBadge = document.getElementById('topbar-streak-count');
    if (streakBadge) {
      streakBadge.textContent = appState.state.stats.streak || 1;
    }
  }

  bindGlobalNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        if (tab) this.switchTab(tab);
      });
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Update tab button styles
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    // Update pane visibility
    document.querySelectorAll('.tab-content-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    const targetPane = document.getElementById(`${tabName}-view`);
    if (targetPane) {
      targetPane.classList.add('active');
    }

    // Refresh module view if needed
    if (this.modules[tabName] && typeof this.modules[tabName].render === 'function') {
      this.modules[tabName].render();
    } else if (tabName === 'placement' && typeof this.modules.placement.renderTrackSelector === 'function') {
      // If returning to placement tab, render track selector if not in active round
      if (!this.modules.placement.timerInterval) {
        this.modules.placement.renderTrackSelector();
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  bindThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const nextTheme = appState.state.settings.theme === 'dark' ? 'light' : 'dark';
        appState.updateSettings({ theme: nextTheme });
        this.applyTheme(nextTheme);
        showToast(`Theme switched to ${nextTheme} mode`, 'info');
      });
    }
  }

  bindSettingsModal() {
    const settingsBtn = document.getElementById('open-settings-btn');
    const modal = document.getElementById('settings-modal');
    const closeBtn = document.getElementById('close-settings-modal-btn');
    const saveBtn = document.getElementById('save-settings-btn');

    if (settingsBtn && modal) {
      settingsBtn.addEventListener('click', () => {
        // Populate inputs with current state
        const nameInput = document.getElementById('setting-candidate-name');
        const roleInput = document.getElementById('setting-target-role');
        const collegeInput = document.getElementById('setting-college');
        const apiKeyInput = document.getElementById('setting-gemini-key');
        const beginnerCheck = document.getElementById('setting-beginner-mode');

        if (nameInput) nameInput.value = appState.state.user.name || '';
        if (roleInput) roleInput.value = appState.state.user.targetRole || '';
        if (collegeInput) collegeInput.value = appState.state.user.college || '';
        if (apiKeyInput) apiKeyInput.value = appState.state.settings.geminiApiKey || '';
        if (beginnerCheck) beginnerCheck.checked = !!appState.state.settings.beginnerMode;

        modal.style.display = 'flex';
      });
    }

    const closeModal = () => {
      if (modal) modal.style.display = 'none';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Test Voice synthesizer
    const testVoiceBtn = document.getElementById('test-voice-btn');
    if (testVoiceBtn) {
      testVoiceBtn.addEventListener('click', () => {
        speechController.speak('Hello! Welcome to InterviewForge. Your campus placement preparation assistant is ready.', () => {
          showToast('Playing speech sample...', 'info');
        });
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const name = document.getElementById('setting-candidate-name')?.value.trim();
        const role = document.getElementById('setting-target-role')?.value.trim();
        const college = document.getElementById('setting-college')?.value.trim();
        const apiKey = document.getElementById('setting-gemini-key')?.value.trim();
        const beginner = document.getElementById('setting-beginner-mode')?.checked;

        appState.updateUserProfile({
          name: name || 'Fresher Candidate',
          targetRole: role || 'Digital / SDE',
          college: college || 'Engineering Student'
        });

        appState.updateSettings({
          geminiApiKey: apiKey || '',
          beginnerMode: beginner
        });

        showToast('Settings saved successfully!', 'success');
        closeModal();
      });
    }
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new InterviewForgeApp();
  window.app.init();
});
