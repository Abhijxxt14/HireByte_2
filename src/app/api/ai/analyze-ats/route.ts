import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import Groq from 'groq-sdk';
import {
  cosineSimilarity,
  calculateKeywordMatch,
  calculateSkillMatch,
  extractTechnicalSkills,
  extractKeywords,
} from '@/lib/ai-utils';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || '');
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Both resume text and job description are required' },
        { status: 400 }
      );
    }

    // Step 1: Calculate semantic similarity using HuggingFace embeddings
    let semanticScore = 50; // default
    try {
      const [resumeEmbedding, jobEmbedding] = await Promise.all([
        hf.featureExtraction({
          model: 'sentence-transformers/all-MiniLM-L6-v2',
          inputs: resumeText.slice(0, 5000), // Limit to avoid token limits
        }),
        hf.featureExtraction({
          model: 'sentence-transformers/all-MiniLM-L6-v2',
          inputs: jobDescription.slice(0, 5000),
        }),
      ]);

      // Convert embeddings to flat number arrays
      const flattenEmbedding = (embedding: any): number[] => {
        if (typeof embedding === 'number') return [embedding];
        if (Array.isArray(embedding)) {
          if (typeof embedding[0] === 'number') return embedding;
          if (Array.isArray(embedding[0])) return embedding[0];
        }
        return [0];
      };

      const resumeVec = flattenEmbedding(resumeEmbedding);
      const jobVec = flattenEmbedding(jobEmbedding);

      // Calculate cosine similarity
      const similarity = cosineSimilarity(resumeVec, jobVec);
      
      semanticScore = Math.round(similarity * 100);
    } catch (embeddingError) {
      console.error('Embedding calculation error:', embeddingError);
    }

    // Step 2: Calculate keyword match
    const keywordScore = calculateKeywordMatch(resumeText, jobDescription);

    // Step 3: Calculate skill match
    const skillScore = calculateSkillMatch(resumeText, jobDescription);

    // Step 4: Calculate weighted final score
    const finalScore = Math.round(
      semanticScore * 0.4 + // 40% semantic similarity
      keywordScore * 0.35 +  // 35% keyword match
      skillScore * 0.25      // 25% skill match
    );

    // Step 5: Use Groq LLaMA to generate detailed feedback
    const resumeSkills = extractTechnicalSkills(resumeText);
    const jobSkills = extractTechnicalSkills(jobDescription);
    const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));

    const feedbackPrompt = `As a senior HR specialist, provide specific feedback for this resume analysis:

RESUME: ${resumeText.slice(0, 2000)}
JOB: ${jobDescription.slice(0, 2000)}

CALCULATED SCORES:
- Overall Match: ${finalScore}/100
- Semantic Similarity: ${semanticScore}/100
- Keyword Match: ${keywordScore.toFixed(1)}%
- Skill Match: ${skillScore.toFixed(1)}%
- Missing Skills: ${missingSkills.join(', ') || 'None'}

Provide feedback in this format:
STRENGTHS:
- [2-3 specific strengths with examples]

WEAKNESSES & IMPROVEMENTS:
- [3-5 specific gaps with actionable fixes]

ATS OPTIMIZATION:
- [2-3 technical suggestions]

KEYWORD GAPS:
- [Missing important keywords]

Keep it concise and actionable. Focus on what matters most.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS specialist providing resume feedback.',
        },
        {
          role: 'user',
          content: feedbackPrompt,
        },
      ],
      model: 'llama-3.1-8b-instant', // Using faster 8B model for feedback
      temperature: 0.3,
      max_tokens: 800,
    });

    const feedback = completion.choices[0]?.message?.content || 'Unable to generate detailed feedback.';

    return NextResponse.json({
      score: Math.max(0, Math.min(100, finalScore)),
      feedback,
      breakdown: {
        semanticScore,
        keywordScore: Math.round(keywordScore),
        skillScore: Math.round(skillScore),
        missingSkills: missingSkills.slice(0, 10),
      },
    });
  } catch (error) {
    console.error('ATS Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    );
  }
}