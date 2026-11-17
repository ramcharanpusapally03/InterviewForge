// Utility Functions: Formatting, Keyword Extraction, Scoring, and Export/Import

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? 'fa-circle-check' :
               type === 'warning' ? 'fa-triangle-exclamation' :
               type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <div class="toast-content">${escapeHtml(message)}</div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// Common technical skills dictionary for fresher recruitment
export const TECH_DICTIONARY = [
  // Languages
  'python', 'java', 'c++', 'c', 'javascript', 'typescript', 'sql', 'html', 'css', 'go', 'rust',
  // Frameworks & Libraries
  'react', 'react.js', 'node.js', 'nodejs', 'express', 'express.js', 'django', 'fastapi', 'flask',
  'spring boot', 'spring', 'angular', 'vue', 'tailwind', 'bootstrap', 'next.js',
  // Databases & Cloud
  'mysql', 'postgresql', 'mongodb', 'sqlite', 'redis', 'firebase', 'aws', 'docker', 'kubernetes', 'git', 'github',
  // Core CS Subjects
  'data structures', 'algorithms', 'dsa', 'oops', 'object oriented', 'dbms', 'operating systems',
  'computer networks', 'system design', 'rest api', 'microservices',
  // Aptitude & Professional
  'problem solving', 'analytical', 'critical thinking', 'teamwork', 'communication', 'agile'
];

export function extractSkills(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found = new Set();

  TECH_DICTIONARY.forEach(skill => {
    // Regex for whole word or term matching
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lower)) {
      found.add(skill);
    }
  });

  return Array.from(found);
}

export function calculateReadinessIndex(stats) {
  // stats = { totalAttempted, totalCorrect, roundsCleared, streak, weakTopicsCount }
  if (!stats || stats.totalAttempted === 0) {
    return { score: 15, tier: 'Getting Started', color: '#94a3b8' };
  }

  const accuracy = (stats.totalCorrect / stats.totalAttempted) * 100;
  const attemptsWeight = Math.min(stats.totalAttempted / 50, 1.0) * 30; // max 30 pts for practice volume
  const accuracyWeight = (accuracy / 100) * 40;                         // max 40 pts for precision
  const roundsWeight = Math.min((stats.roundsCleared || 0) * 5, 20);    // max 20 pts for full placement runs
  const streakBonus = Math.min((stats.streak || 0) * 2, 10);            // max 10 pts for consistency

  const finalScore = Math.min(Math.round(attemptsWeight + accuracyWeight + roundsWeight + streakBonus), 100);

  let tier = 'Foundation Needed';
  let color = '#ef4444';

  if (finalScore >= 85) {
    tier = 'Prime / Product SDE Ready';
    color = '#10b981';
  } else if (finalScore >= 70) {
    tier = 'Digital / Specialist Ready';
    color = '#3b82f6';
  } else if (finalScore >= 50) {
    tier = 'Ninja / Mass Hiring Ready';
    color = '#f59e0b';
  }

  return { score: finalScore, tier, color };
}

export function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
