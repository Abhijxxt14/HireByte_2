
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
    if (!tokens) return [];
    const filteredTokens = tokens.filter(token => !Stopwords.includes(token) && /^[a-z]+$/.test(token));
    return filteredTokens.map(token => PorterStemmer.stem(token));
};

// Main scoring function
export function scoreResumeWithKeywords(
    resumeSections: ResumeTextSections,
    jobDescription: string
): KeywordAtsResult | { error: string } {

    try {
        const jdTokens = tokenizer.tokenize(jobDescription.toLowerCase());
        if (!jdTokens) {
            return { score: 0, matchedKeywords: [], missingKeywords: [] };
        }
        
        const originalKeywordsMap: { [key: string]: string } = {};
        const jdStems = new Set<string>();

        const filteredJdTokens = jdTokens.filter(token => !Stopwords.includes(token) && /^[a-z]+$/.test(token));

        filteredJdTokens.forEach(token => {
            const stem = PorterStemmer.stem(token);
            jdStems.add(stem);
            if (!originalKeywordsMap[stem]) {
                originalKeywordsMap[stem] = token;
            }
        });

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
            if (resumeStems.skills.has(stem)) {
                weightedScore += 3;
                matched = true;
            }
            else if (resumeStems.experience.has(stem)) {
                weightedScore += 2;
                matched = true;
            }
            else if (resumeStems.other.has(stem)) {
                weightedScore += 1;
                matched = true;
            }

            if (matched) {
                allMatchedStems.add(stem);
            }
        });

        const maxPossibleScore = jdStems.size * 3;
        const normalizedScore = maxPossibleScore > 0 ? (weightedScore / maxPossibleScore) * 100 : 0;
        
        const matchedKeywords = Array.from(allMatchedStems).map(stem => originalKeywordsMap[stem] || stem);
        const missingKeywords = Array.from(jdStems)
            .filter(stem => !allMatchedStems.has(stem))
            .map(stem => originalKeywordsMap[stem] || stem);

        return {
            score: Math.min(100, Math.round(normalizedScore)),
            matchedKeywords: [...new Set(matchedKeywords)],
            missingKeywords: [...new Set(missingKeywords)],
        };
    } catch (error: any) {
        console.error("Error within scoreResumeWithKeywords:", error);
        return { error: error.message || "An internal error occurred during keyword analysis." };
    }
}
