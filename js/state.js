// Centralized Reactive State Store with LocalStorage Persistence

const STORAGE_KEY = 'interviewforge_state_v1';

const DEFAULT_STATE = {
  user: {
    name: 'Practicing Candidate',
    targetCompany: 'product_sde1',
    targetRole: 'Software Developer / SDE',
    college: 'Self-Taught / University'
  },
  settings: {
    theme: 'dark',
    beginnerMode: true, // Auto-explain incorrect concepts immediately
    voiceEnabled: true,
    geminiApiKey: ''
  },
  stats: {
    totalAttempted: 0,
    totalCorrect: 0,
    roundsCleared: 0,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0]
  },
  weaknessMap: {}, // { 'Time and Work': { wrong: 2, total: 3 }, 'DBMS & SQL': { wrong: 3, total: 4 } }
  history: [], // Past completed placement/mock sessions
  savedProjects: [], // Custom college projects added by user
  bookmarks: [] // Saved question IDs
};

class StateManager {
  constructor() {
    this.state = this.loadState();
    this.listeners = new Set();
    this.updateDailyStreak();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STATE,
          ...parsed,
          user: { ...DEFAULT_STATE.user, ...(parsed.user || {}) },
          settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
          stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
          weaknessMap: parsed.weaknessMap || {},
          history: parsed.history || [],
          savedProjects: parsed.savedProjects || [],
          bookmarks: parsed.bookmarks || []
        };
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('State listener error:', err);
      }
    }
  }

  updateDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const last = this.state.stats.lastActiveDate;

    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (last === yesterday) {
        this.state.stats.streak = (this.state.stats.streak || 0) + 1;
      } else {
        // Reset streak if gap > 1 day
        this.state.stats.streak = 1;
      }
      this.state.stats.lastActiveDate = today;
      this.save();
    }
  }

  recordAnswer(topic, isCorrect) {
    this.state.stats.totalAttempted += 1;
    if (isCorrect) {
      this.state.stats.totalCorrect += 1;
    }

    // Update Weakness Tracker
    if (!this.state.weaknessMap[topic]) {
      this.state.weaknessMap[topic] = { wrong: 0, total: 0, lastReviewed: Date.now() };
    }
    this.state.weaknessMap[topic].total += 1;
    if (!isCorrect) {
      this.state.weaknessMap[topic].wrong += 1;
    }
    this.state.weaknessMap[topic].lastReviewed = Date.now();

    this.save();
  }

  recordSession(sessionData) {
    this.state.history.unshift({
      id: 'sess_' + Date.now(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      ...sessionData
    });
    if (sessionData.clearedAllRounds) {
      this.state.stats.roundsCleared = (this.state.stats.roundsCleared || 0) + 1;
    }
    // Keep last 30 sessions
    if (this.state.history.length > 30) {
      this.state.history.pop();
    }
    this.save();
  }

  toggleBookmark(questionId) {
    const index = this.state.bookmarks.indexOf(questionId);
    if (index > -1) {
      this.state.bookmarks.splice(index, 1);
    } else {
      this.state.bookmarks.push(questionId);
    }
    this.save();
    return this.state.bookmarks.includes(questionId);
  }

  isBookmarked(questionId) {
    return this.state.bookmarks.includes(questionId);
  }

  saveProject(project) {
    const existingIdx = this.state.savedProjects.findIndex(p => p.id === project.id);
    if (existingIdx > -1) {
      this.state.savedProjects[existingIdx] = project;
    } else {
      this.state.savedProjects.push({
        ...project,
        id: 'proj_' + Date.now(),
        createdAt: new Date().toISOString()
      });
    }
    this.save();
  }

  deleteProject(projectId) {
    this.state.savedProjects = this.state.savedProjects.filter(p => p.id !== projectId);
    this.save();
  }

  updateSettings(newSettings) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.save();
  }

  updateUserProfile(profile) {
    this.state.user = { ...this.state.user, ...profile };
    this.save();
  }

  resetAllData() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
  }

  importData(importedState) {
    if (importedState && typeof importedState === 'object') {
      this.state = {
        ...DEFAULT_STATE,
        ...importedState,
        stats: { ...DEFAULT_STATE.stats, ...(importedState.stats || {}) }
      };
      this.save();
      return true;
    }
    return false;
  }
}

export const appState = new StateManager();
