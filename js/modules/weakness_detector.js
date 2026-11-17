// Weakness Detector & Clinic: Identifies recurring student error clusters with concept flashcards
import { appState } from '../state.js';
import { APTITUDE_QUESTIONS } from '../data/questions_aptitude.js';
import { TECHNICAL_QUESTIONS } from '../data/questions_technical.js';
import { showToast, escapeHtml } from '../utils/helpers.js';

// Pre-compiled high-yield concept review flashcards for common campus placement topics
const CONCEPT_FLASHCARDS = {
  'Time and Work': {
    title: 'Time, Work & Efficiency Master Formula',
    summary: 'Work = Rate * Time. Always use LCM of individual completion days as total work to avoid tedious fractional calculations.',
    keyFormulas: [
      'Total Work = LCM(days taken by A, B, C)',
      'A\'s Daily Efficiency = Total Work / A\'s Days',
      'Combined Rate = Efficiency_A + Efficiency_B'
    ],
    commonTrap: 'Assuming rates add like days! 10 days + 15 days is NEVER 25 days; calculate daily rates (1/10 + 1/15) or LCM units.'
  },
  'DBMS & SQL': {
    title: 'SQL Joins, ACID & DDL vs DML',
    summary: 'Relational databases enforce transactional integrity and structure. DDL defines schema; DML manipulates records.',
    keyFormulas: [
      'INNER JOIN: Intersection of both tables matching ON predicate',
      'LEFT JOIN: All rows from left table + matched rows from right (NULL if none)',
      'TRUNCATE = DDL (deallocates pages, resets auto_increment, cannot rollback without active txn in some engines)',
      'DELETE = DML (row-by-row, triggers fire, WHERE supported)'
    ],
    commonTrap: 'Mixing WHERE with HAVING: WHERE filters rows before aggregation; HAVING filters groups after GROUP BY.'
  },
  'OOPs Concepts': {
    title: 'The 4 Pillars & Dynamic Polymorphism',
    summary: 'Abstraction (hiding complexity), Encapsulation (data bundling + accessors), Inheritance (reusability), Polymorphism (many forms).',
    keyFormulas: [
      'Overloading = Compile-Time (Static dispatch, same method name, different parameters)',
      'Overriding = Runtime (Dynamic dispatch, child redefines parent method with identical signature)',
      'Java avoids multiple class inheritance to prevent the Diamond Problem'
    ],
    commonTrap: 'Saying abstract classes and interfaces are identical. Interfaces represent capability ("can-do"); abstract classes represent core identity ("is-a").'
  },
  'Operating Systems': {
    title: 'Processes, Threads & Deadlock Coffman Conditions',
    summary: 'A Process is an isolated program in execution; Threads are lightweight execution units within a process sharing heap & code segments.',
    keyFormulas: [
      '4 Deadlock Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait',
      'Breaking any one condition prevents deadlock (e.g. Bank\'s algorithm, resource ordering)'
    ],
    commonTrap: 'Believing threads don\'t have their own memory: Each thread MUST have its own dedicated stack and register set!'
  },
  'Speed, Time and Distance': {
    title: 'Relative Speed & Train Problems',
    summary: 'Distance = Speed * Time. Convert units immediately before starting calculations.',
    keyFormulas: [
      '1 km/h = 5/18 m/s',
      '1 m/s = 18/5 km/h',
      'Trains moving in opposite directions: Relative Speed = S1 + S2',
      'Trains moving in same direction: Relative Speed = |S1 - S2|'
    ],
    commonTrap: 'Forgetting to add the platform length to the train length when calculating distance to cross a bridge or station.'
  },
  'Data Structures & Algorithms': {
    title: 'Algorithm Complexity & Tree Traversal',
    summary: 'Time complexity is asymptotic upper bound of operations as input size n approaches infinity.',
    keyFormulas: [
      'Binary Search: O(log n) time, requires sorted collection',
      'QuickSort: Average O(n log n), Worst Case O(n^2) on sorted data with poor pivot',
      'Hash Table: O(1) average lookup, degrades to O(n) on heavy bucket collisions'
    ],
    commonTrap: 'Using QuickSort when stable sorting is required; QuickSort is generally not stable without index augmentation (use MergeSort instead).'
  }
};

export class WeaknessDetector {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    const weaknessMap = appState.state.weaknessMap || {};
    const topics = Object.keys(weaknessMap);

    const criticalList = [];
    const moderateList = [];
    const masteredList = [];

    topics.forEach(topic => {
      const data = weaknessMap[topic];
      const accuracy = data.total > 0 ? ((data.total - data.wrong) / data.total) * 100 : 100;
      const item = { topic, ...data, accuracy: Math.round(accuracy) };

      if (data.wrong >= 2 && accuracy < 60) {
        criticalList.push(item);
      } else if (data.wrong >= 1 || accuracy < 75) {
        moderateList.push(item);
      } else {
        masteredList.push(item);
      }
    });

    this.container.innerHTML = `
      <div class="weakness-clinic-wrapper">
        <div class="clinic-header">
          <div>
            <h2><i class="fa-solid fa-stethoscope text-accent"></i> Automated Weakness Clinic & Concept Explainer</h2>
            <p class="subtitle">Identifies subjects and technical subtopics where you repeatedly make mistakes across placement rounds, serving targeted 3-minute conceptual cure flashcards.</p>
          </div>
          <div class="clinic-summary-pill">
            <span class="badge badge-danger">${criticalList.length} Critical</span>
            <span class="badge badge-warning">${moderateList.length} Needs Work</span>
            <span class="badge badge-success">${masteredList.length} Mastered</span>
          </div>
        </div>

        ${topics.length === 0 ? `
          <div class="empty-state-box">
            <i class="fa-solid fa-wand-magic-sparkles text-accent text-3xl"></i>
            <h3>No Weakness Clusters Detected Yet!</h3>
            <p class="text-muted">Take a mock drive in the <strong>Placement Arena</strong> or practice questions in the <strong>Mock Room</strong> to enable AI error pattern recognition.</p>
            <div class="high-yield-suggestions">
              <h4>Recommended High-Yield Placement Topics to Explore:</h4>
              <div class="flashcard-preview-grid">
                ${Object.keys(CONCEPT_FLASHCARDS).slice(0, 3).map(key => `
                  <div class="topic-teaser-card" data-topic-name="${escapeHtml(key)}">
                    <h5><i class="fa-solid fa-book-bookmark text-accent"></i> ${escapeHtml(key)}</h5>
                    <p class="small text-muted">${escapeHtml(CONCEPT_FLASHCARDS[key].title)}</p>
                    <button class="btn btn-outline btn-sm view-concept-btn" data-topic="${escapeHtml(key)}">Read Concept Card</button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : `
          <!-- Weakness Cards Grid -->
          <div class="weakness-sections">
            ${criticalList.length > 0 ? `
              <div class="weakness-category-group">
                <h4 class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> Critical Priority Topics (High Placement Risk)</h4>
                <div class="weakness-cards-grid">
                  ${criticalList.map(item => this.renderTopicCard(item, 'critical')).join('')}
                </div>
              </div>
            ` : ''}

            ${moderateList.length > 0 ? `
              <div class="weakness-category-group">
                <h4 class="text-warning"><i class="fa-solid fa-circle-exclamation"></i> Moderate Review Topics</h4>
                <div class="weakness-cards-grid">
                  ${moderateList.map(item => this.renderTopicCard(item, 'moderate')).join('')}
                </div>
              </div>
            ` : ''}

            ${masteredList.length > 0 ? `
              <div class="weakness-category-group">
                <h4 class="text-success"><i class="fa-solid fa-circle-check"></i> Strong / Mastered Topics</h4>
                <div class="weakness-cards-grid">
                  ${masteredList.map(item => this.renderTopicCard(item, 'mastered')).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `}

        <!-- Concept Flashcard Modal -->
        <div class="modal-backdrop" id="concept-modal" style="display: none;">
          <div class="modal-dialog modal-lg">
            <div class="modal-header">
              <h3 id="concept-modal-title"><i class="fa-solid fa-book-open text-accent"></i> Concept Flashcard</h3>
              <button class="btn-close-modal" id="close-concept-modal-btn">&times;</button>
            </div>
            <div class="modal-body" id="concept-modal-body">
              <!-- Injected dynamically -->
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" id="dismiss-concept-btn">I Understand This Concept</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderTopicCard(item, level) {
    const borderClass = level === 'critical' ? 'card-critical' : level === 'moderate' ? 'card-moderate' : 'card-mastered';
    return `
      <div class="weakness-card ${borderClass}">
        <div class="wc-header">
          <span class="wc-topic-name">${escapeHtml(item.topic)}</span>
          <span class="wc-accuracy ${level}">${item.accuracy}% Accuracy</span>
        </div>
        <div class="wc-stats">
          <span>Total Seen: <strong>${item.total}</strong></span>
          <span>Errors: <strong class="text-danger">${item.wrong}</strong></span>
        </div>
        <div class="wc-progress-bar">
          <div class="wc-progress-fill ${level}" style="width: ${item.accuracy}%"></div>
        </div>
        <div class="wc-actions">
          <button class="btn btn-outline btn-sm view-concept-btn" data-topic="${escapeHtml(item.topic)}">
            <i class="fa-solid fa-book-open"></i> Read Concept
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // View concept buttons
    this.container.querySelectorAll('.view-concept-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const topic = e.currentTarget.getAttribute('data-topic');
        this.openConceptModal(topic);
      });
    });

    const modal = document.getElementById('concept-modal');
    const closeBtn = document.getElementById('close-concept-modal-btn');
    const dismissBtn = document.getElementById('dismiss-concept-btn');

    const closeModal = () => {
      if (modal) modal.style.display = 'none';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  }

  openConceptModal(topic) {
    const modal = document.getElementById('concept-modal');
    const titleEl = document.getElementById('concept-modal-title');
    const bodyEl = document.getElementById('concept-modal-body');
    if (!modal || !bodyEl) return;

    const card = CONCEPT_FLASHCARDS[topic] || {
      title: `${topic} Placement Essentials`,
      summary: `Detailed review guide for ${topic}. Focus on core definitions, runtime bounds, and edge cases.`,
      keyFormulas: [
        'Master the fundamental definitions and syntax.',
        'Review standard interview corner cases and negative inputs.'
      ],
      commonTrap: 'Rushing into calculations without verifying question units or constraints.'
    };

    if (titleEl) {
      titleEl.innerHTML = `<i class="fa-solid fa-book-open text-accent"></i> ${escapeHtml(topic)}: ${escapeHtml(card.title)}`;
    }

    bodyEl.innerHTML = `
      <div class="concept-flashcard-content">
        <div class="concept-section">
          <h4><i class="fa-solid fa-circle-info text-accent"></i> Overview & Core Intuition</h4>
          <p>${escapeHtml(card.summary)}</p>
        </div>

        <div class="concept-section">
          <h4><i class="fa-solid fa-bolt text-warning"></i> Key Formulas & Placement Rules</h4>
          <ul class="formula-list">
            ${card.keyFormulas.map(f => `<li><code>${escapeHtml(f)}</code></li>`).join('')}
          </ul>
        </div>

        <div class="concept-section concept-trap-box">
          <h4><i class="fa-solid fa-skull-crossbones text-danger"></i> Common Fresher Trap to Avoid</h4>
          <p>${escapeHtml(card.commonTrap)}</p>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }
}
