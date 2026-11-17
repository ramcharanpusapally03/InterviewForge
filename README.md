# 🚀 InterviewForge — Prepare. Practice. Improve.
### *Personalized Campus Placement & Interview Prep Platform for Indian Freshers*

![Platform Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Built For](https://img.shields.io/badge/Audience-Indian%20College%20Freshers-blue)
![Zero Dependency](https://img.shields.io/badge/Dependencies-Zero%20Install-brightgreen)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## 💡 What Problem Does It Solve?

Thousands of engineering students and college freshers struggle during campus recruitment drives. They often face four distinct bottlenecks:
1. **Unrealistic Practice**: Most websites merely list static question banks without simulating the actual multi-round elimination pressure (Aptitude $\rightarrow$ Pseudocode $\rightarrow$ Technical Viva $\rightarrow$ HR).
2. **The "Project Viva" Freeze**: In 80% of technical interviews, candidates freeze when asked to defend their own college capstone projects (*"Why this database over alternatives?", "How does your architecture handle 10,000 requests?", "What was your hardest bug?"*).
3. **No Weakness Diagnosis**: Candidates repeat the same mistakes without realizing which subtopics (e.g. *SQL Joins, OOPs Polymorphism, Time-Work Efficiency, Deadlock Conditions*) are dragging down their percentiles.
4. **Generic AI Chatbots**: Standard AI tools give generic answers without adhering to company-specific hiring rubrics (TCS NQT, Infosys DSE, Wipro, Accenture) or the structured STAR method.

**InterviewForge** was engineered to solve these exact hurdles.

---

## ✨ Standout Features

### 1. 🎯 Campus Placement Simulation Arena
- Authentic 4-round recruitment drives for India's leading campus recruiters:
  - **TCS NQT Track** (Cognitive Aptitude, Pseudocode/Technical, Technical Viva, HR)
  - **Infosys Specialist / DSE Track** (Reasoning, DBMS/Pseudocode, OOPs Viva, Behavioral)
  - **Wipro (Elite & Turbo) Track** (Aptitude, Verbal, Core CS, HR Fit)
  - **Accenture (ASE & FSE) Track** (Critical Thinking, Cloud/Common Apps, Technical, Scenario-based)
  - **Product Companies Track (SDE-1)** (Logic Puzzles, DSA Deep Dive, System Basics, Behavioral)
- **Beginner Mode**: Toggle immediate step-by-step mathematical solutions and code traces after every question.
- Strict round cutoffs with real-time timers and official placement qualification report cards.

### 2. 🎙️ Live Mock Interview Room (Split-Screen & Voice-Enabled)
- **Virtual Interviewer**: Realistic avatar with soundwave visualizer and Web Speech API text-to-speech (`speechSynthesis`) that reads questions aloud naturally.
- **Voice-to-Text Input**: Practice speaking your answers directly via your microphone (`SpeechRecognition`), transcribing speech into the response console in real time.
- **Rubric & STAR Framework Guidance**: Built-in prompts for Situation, Task, Action, and Result.
- **Multi-Dimensional AI Evaluation**: Scores clarity, structure, and technical depth (0-100), highlights key strengths, provides actionable suggestions, and delivers dynamic interviewer follow-up questions.

### 3. 🛠️ Project Viva Defense Studio
- Practice defending your actual final-year college or resume projects.
- Includes pre-configured templates (e.g., *BuddyMatch Campus Utility, IoT Telemetry Dashboard, E-Commerce Storefront*) plus an **"Add Your College Project"** custom studio.
- Generates 6 deep-dive viva grilling probes:
  1. *Architecture & System Request-Response Flow*
  2. *Database Selection & Schema Design Rationale*
  3. *Authentication, JWT Security & Password Hashing*
  4. *High-Traffic Scalability & Bottleneck Triage*
  5. *Troubleshooting & Diagnosing the Hardest Bug*
  6. *Self-Critique, Technical Debt & Future Architecture*
- Displays what the interviewer is secretly testing, key technical terms to mention, and model defense strategies.

### 4. 🧠 Automated Weakness Clinic & Concept Explainer
- Automatically monitors your performance across every topic and clusters your error patterns.
- Categorizes topics into **Critical Priority (High Placement Risk)**, **Moderate Review**, and **Mastered**.
- 1-Click **Concept Review Flashcards**: Bite-sized cheat sheets providing core intuition, essential placement formulas, and common traps to avoid.

### 5. 📄 Resume-to-Job Matching & Gap Analyzer
- Compare candidate resume content against real fresher job descriptions.
- Highlights **Matched Competencies**, **Missing Skills to Prepare**, and **Bonus Differentiation Skills**.
- Generates a **1-Click Targeted Practice Plan** to drill the exact missing skills in the Arena.

### 6. 📊 Campus Placement Readiness Index
- Dynamic 0–100 Readiness Score factoring in question practice volume, accuracy percentages, full drives cleared, and consistency streaks.
- Unlocks company tiers (*Ninja $\rightarrow$ Digital $\rightarrow$ Prime / SDE-1*).
- Complete session history logs with exportable/importable JSON progress backups.

---

## 🛠️ Architecture & Tech Stack

InterviewForge is built with a zero-friction, production-grade client-side architecture:
- **Frontend Core**: Semantic HTML5, Modern CSS3 with dark/light themes and glassmorphism.
- **Typography & Icons**: Google Fonts (`Inter`, `Outfit`, `JetBrains Mono`) and FontAwesome 6.
- **Audio & Speech Engine**: Native HTML5 Web Speech API (SpeechSynthesis & SpeechRecognition).
- **Data & Persistence**: Reactive State Store backed by `localStorage` with JSON export/import.
- **AI Engine**: Modular dual engine — built-in enterprise rubric heuristic scoring by default, with an optional toggle for live **Google Gemini API** dynamic evaluations.
- **Zero-Build & Zero-Dependency**: Runs instantly in any modern web browser or lightweight web server.

---

## 🚀 How to Run Locally

### Option 1: Double-Click Launcher (Windows)
Double-click `start_interviewforge.bat` in the project root. It will start a local server and open `http://localhost:8000` in your default browser.

### Option 2: Python HTTP Server (Cross-Platform)
```bash
cd interviewforge
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

### Option 3: Direct Browser Launch
Simply open `index.html` directly in Google Chrome, Microsoft Edge, or Firefox.

---

## 🌐 Deploying to Production

### Deploying to GitHub Pages
1. Push this directory to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of InterviewForge"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to **Settings > Pages** in your GitHub repository and select the `main` branch.
3. Your live application will be instantly accessible globally!

---

## 🎯 Dual-Purpose Positioning

- **As a Developer Portfolio Masterpiece**: Showcases deep full-stack architecture, clean code organization, Web Speech API integration, and thoughtful UX addressing real student needs.
- **As a Real Campus Placement Product**: 100% functional, ready to share with college batchmates, juniors, and placement cells across engineering campuses.

---

*Crafted for ambitious engineering freshers aiming for top placement offers.*
