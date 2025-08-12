
import { PorterStemmer, Stopwords, WordTokenizer } from 'natural';
import type { ResumeTextSections } from './types';

export interface KeywordAtsResult {
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
}

const tokenizer = new WordTokenizer();

// Helper to process text: tokenize, lowercase, remove stopwords, and stem
const processTextToStems = (text: string): string[] => {
    if (!text) return [];
    const tokens = tokenizer.tokenize(text.toLowerCase());
    if (!tokens) return []; // Add null check for tokenizer result
    const filteredTokens = tokens.filter(token => !Stopwords.includes(token) && /^[a-z]+$/.test(token));
    return filteredTokens.map(token => PorterStemmer.stem(token));
};

// Main scoring function
export function scoreResumeWithKeywords(
    resumeSections: ResumeTextSections,
    jobDescription: string
): KeywordAtsResult {
    const jdStems = new Set(processTextToStems(jobDescription));
    if (jdStems.size === 0) {
        return { score: 0, matchedKeywords: [], missingKeywords: [] };
    }

    const resumeStems = {
        skills: new Set(processTextToStems(resumeSections.skills)),
        experience: new Set(processTextToStems(resumeSections.experience)),
        other: new Set(processTextToStems(resumeSections.other)),
    }

    let weightedScore = 0;
    const allMatchedStems = new Set<string>();

    jdStems.forEach(stem => {
        let matched = false;
        // Check skills section (weight: 3)
        if (resumeStems.skills.has(stem)) {
            weightedScore += 3;
            matched = true;
        }
        // Check experience section (weight: 2)
        else if (resumeStems.experience.has(stem)) {
            weightedScore += 2;
            matched = true;
        }
        // Check other sections (weight: 1)
        else if (resumeStems.other.has(stem)) {
            weightedScore += 1;
            matched = true;
        }

        if (matched) {
            allMatchedStems.add(stem);
        }
    });

    // Calculate max possible score for normalization
    const maxPossibleScore = jdStems.size * 3; // Max weight for every keyword
    
    // Normalize score to be out of 100
    const normalizedScore = maxPossibleScore > 0 ? (weightedScore / maxPossibleScore) * 100 : 0;
    
    // Find original keywords from stems for reporting
    const originalKeywordsMap: { [key: string]: string } = {};

    const jdTokens = tokenizer.tokenize(jobDescription.toLowerCase());
    
    if (jdTokens) {
        const filteredTokens = jdTokens.filter(token => !Stopwords.includes(token) && /^[a-z]+$/.test(token));

        filteredTokens.forEach(token => {
            const stem = PorterStemmer.stem(token);
            if (jdStems.has(stem) && !originalKeywordsMap[stem]) {
                originalKeywordsMap[stem] = token;
            }
        });
    }


    const matchedKeywords = Array.from(allMatchedStems).map(stem => originalKeywordsMap[stem] || stem);
    const missingKeywords = Array.from(jdStems)
        .filter(stem => !allMatchedStems.has(stem))
        .map(stem => originalKeywordsMap[stem] || stem);

    return {
        score: Math.min(100, Math.round(normalizedScore)),
        matchedKeywords: [...new Set(matchedKeywords)], // Ensure uniqueness
        missingKeywords: [...new Set(missingKeywords)], // Ensure uniqueness
    };
}
