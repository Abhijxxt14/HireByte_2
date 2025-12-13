import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

// Initialize Groq (primary)
const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

// Initialize Gemini (fallback)
const gemini = process.env.GOOGLE_GEMINI_API_KEY ? new GoogleGenerativeAI(
  process.env.GOOGLE_GEMINI_API_KEY
) : null;

export interface ATSAnalysisResult {
  score: number;
  feedback: string;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
}

export async function analyzeResumeWithAI(
  resumeText: string,
  jobDescription: string
): Promise<ATSAnalysisResult> {
  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach.

Analyze this resume against the job description and provide:
1. An ATS compatibility score (0-100)
2. Key strengths (3-5 points)
3. Key weaknesses (3-5 points)
4. Specific, actionable suggestions for improvement (5-7 points)

Resume:
${resumeText}

Job Description:
${jobDescription}

Respond with a JSON object in this exact format:
{
  "score": <number 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"]
}`;

  try {
    // Try Groq first (faster and more reliable)
    if (groq) {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2000,
      });

      const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
      
      // Format the feedback from structured data
      const feedback = formatFeedback(result);
      
      return {
        score: result.score || 0,
        feedback,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        suggestions: result.suggestions,
      };
    }

    // Fallback to Gemini if Groq fails or is not configured
    if (gemini) {
      const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const result = await model.generateContent(prompt + '\n\nIMPORTANT: Respond only with valid JSON, no markdown or other text.');
      const response = await result.response;
      const text = response.text();
      
      // Clean up potential markdown wrapping
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(jsonText);
      
      const feedback = formatFeedback(parsed);
      
      return {
        score: parsed.score || 0,
        feedback,
        strengths: parsed.strengths,
        weaknesses: parsed.weaknesses,
        suggestions: parsed.suggestions,
      };
    }

    throw new Error('No AI service configured. Please set GROQ_API_KEY or GOOGLE_GEMINI_API_KEY');
  } catch (error) {
    console.error('AI analysis error:', error);
    throw error;
  }
}

function formatFeedback(result: any): string {
  let feedback = '';
  
  if (result.strengths && result.strengths.length > 0) {
    feedback += '✅ **Strengths:**\n';
    result.strengths.forEach((s: string) => {
      feedback += `• ${s}\n`;
    });
    feedback += '\n';
  }
  
  if (result.weaknesses && result.weaknesses.length > 0) {
    feedback += '⚠️ **Areas for Improvement:**\n';
    result.weaknesses.forEach((w: string) => {
      feedback += `• ${w}\n`;
    });
    feedback += '\n';
  }
  
  if (result.suggestions && result.suggestions.length > 0) {
    feedback += '💡 **Actionable Suggestions:**\n';
    result.suggestions.forEach((s: string) => {
      feedback += `• ${s}\n`;
    });
  }
  
  return feedback.trim();
}
