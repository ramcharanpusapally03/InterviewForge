// AI Service: Live Gemini Evaluation & Offline Heuristic Feedback Engine
import { appState } from '../state.js';
import { extractSkills } from '../utils/helpers.js';

class AIService {
  constructor() {
    this.model = 'gemini-1.5-flash';
  }

  getApiKey() {
    return appState.state.settings.geminiApiKey || '';
  }

  hasApiKey() {
    const key = this.getApiKey().trim();
    return key.length > 15;
  }

  async evaluateAnswer({ question, answer, category, rubric, expectedKeywords = [] }) {
    if (!answer || answer.trim().length < 10) {
      return {
        score: 25,
        rating: 'Insufficient Response',
        strengths: ['Attempted to respond.'],
        improvements: ['Answer is too brief. Provide more technical details, context, and structured outcomes.'],
        followUp: 'Can you elaborate on your specific technical role or the exact implementation details?'
      };
    }

    if (this.hasApiKey()) {
      try {
        return await this.evaluateWithGemini({ question, answer, category, rubric });
      } catch (err) {
        console.warn('Gemini API call failed, falling back to heuristic evaluation:', err);
      }
    }

    return this.evaluateHeuristic({ question, answer, category, rubric, expectedKeywords });
  }

  async evaluateWithGemini({ question, answer, category, rubric }) {
    const apiKey = this.getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`;

    const prompt = `You are a Senior Technical Interviewer and Campus Hiring Manager at a premier tech firm conducting an interview with an Indian college fresher.
Evaluate the candidate's answer strictly yet constructively.

Question: "${question}"
Category: "${category}"
Guideline Rubric: "${JSON.stringify(rubric || {})}"

Candidate's Answer:
"${answer}"

Respond ONLY with valid JSON matching this exact structure:
{
  "score": <number between 0 and 100>,
  "rating": "<Needs Improvement | Fair | Good | Excellent | Exceptional>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<actionable improvement 1>", "<actionable improvement 2>"],
  "followUp": "<a realistic, challenging interviewer follow-up question based on what they said>"
}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON from code fence if needed
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse Gemini JSON response');
  }

  evaluateHeuristic({ question, answer, category, rubric, expectedKeywords }) {
    const words = answer.trim().split(/\s+/).length;
    const foundKeywords = extractSkills(answer);
    
    let baseScore = 50;
    const strengths = [];
    const improvements = [];

    // Word count evaluation
    if (words >= 70 && words <= 250) {
      baseScore += 20;
      strengths.push('Good answer length (~' + words + ' words) suitable for an interview response.');
    } else if (words < 40) {
      baseScore -= 15;
      improvements.push('Answer is somewhat brief. Expand with concrete examples and technical depth.');
    } else {
      baseScore += 10;
      improvements.push('Answer is slightly long-winded. Focus on delivering concise, high-impact statements.');
    }

    // Keyword & Depth Evaluation
    if (foundKeywords.length > 0) {
      baseScore += Math.min(foundKeywords.length * 5, 20);
      strengths.push(`Good utilization of relevant technical terms: ${foundKeywords.slice(0, 4).join(', ')}.`);
    } else if (category === 'Core CS' || category === 'Viva') {
      improvements.push('Include more precise technical terms (e.g. data structures, complexity, protocols).');
    }

    // Behavioral Structure Check (STAR indicators)
    const lower = answer.toLowerCase();
    const hasSituation = lower.includes('when') || lower.includes('project') || lower.includes('during') || lower.includes('semester');
    const hasAction = lower.includes('i decided') || lower.includes('i implemented') || lower.includes('i created') || lower.includes('i resolved') || lower.includes('we chose');
    const hasResult = lower.includes('result') || lower.includes('outcome') || lower.includes('led to') || lower.includes('reduced') || lower.includes('delivered') || lower.includes('improved');

    if (hasSituation && hasAction && hasResult) {
      baseScore += 15;
      strengths.push('Follows the structured STAR technique (Situation -> Action -> Result).');
    } else if (category === 'HR' || category === 'Behavioral') {
      improvements.push('Structure your response using the STAR method: state the Situation, Task, your specific Action, and the final Result.');
    }

    const finalScore = Math.min(Math.max(baseScore, 30), 96);

    let rating = 'Fair';
    if (finalScore >= 85) rating = 'Excellent';
    else if (finalScore >= 70) rating = 'Good';
    else if (finalScore < 50) rating = 'Needs Improvement';

    if (improvements.length === 0) {
      improvements.push('Add quantitative impact metrics (e.g., "% latency reduced", "number of concurrent users handled").');
    }

    // Generate intelligent contextual follow-up
    let followUp = 'If you had to scale this or revisit your design with tighter deadlines, what trade-offs would you make?';
    if (category === 'Core CS' || category === 'Viva') {
      followUp = 'What is the worst-case space and time complexity of your approach, and how does it handle corner cases?';
    } else if (category === 'HR') {
      followUp = 'How would you apply what you learned from this experience if a similar challenge occurred in your first 90 days on our project?';
    }

    return {
      score: finalScore,
      rating,
      strengths,
      improvements,
      followUp
    };
  }
}

export const aiService = new AIService();
