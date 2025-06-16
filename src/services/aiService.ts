import { gql } from '../../Scripts/spellbook-api.js';
import { mockAIService } from './mockService';

const USE_MOCK = false; // Set to true to use mock data

interface AnalysisRequest {
  text: string;
  type: 'review' | 'suggest' | 'draft' | 'revise';
  options?: {
    stance?: 'customer' | 'provider' | 'neutral';
    tone?: 'formal' | 'casual' | 'professional';
    jurisdiction?: string;
  };
}

interface AnalysisResponse {
  suggestions: Array<{
    id: string;
    type: 'addition' | 'deletion' | 'modification' | 'comment';
    originalText?: string;
    suggestedText?: string;
    explanation: string;
    confidence: number;
  }>;
  summary?: string;
}

class AIService {
  async analyzeText(request: AnalysisRequest): Promise<AnalysisResponse> {
    if (USE_MOCK) {
      return mockAIService.analyzeText(request);
    }

    const query = `
      mutation AnalyzeText($input: AnalysisInput!) {
        analyzeText(input: $input) {
          suggestions {
            id
            type
            originalText
            suggestedText
            explanation
            confidence
          }
          summary
        }
      }
    `;

    const response = await gql(query, { input: request });
    return response.analyzeText;
  }

  async askQuestion(documentText: string, question: string): Promise<string> {
    if (USE_MOCK) {
      return mockAIService.askQuestion(documentText, question);
    }

    const query = `
      mutation AskQuestion($documentText: String!, $question: String!) {
        askQuestion(documentText: $documentText, question: $question) {
          answer
          relevantExcerpts
        }
      }
    `;

    const response = await gql(query, { documentText, question });
    return response.askQuestion.answer;
  }

  async draftClause(clauseType: string, context: string): Promise<string> {
    if (USE_MOCK) {
      return mockAIService.draftClause(clauseType, context);
    }

    const query = `
      mutation DraftClause($clauseType: String!, $context: String!) {
        draftClause(clauseType: $clauseType, context: $context) {
          text
        }
      }
    `;

    const response = await gql(query, { clauseType, context });
    return response.draftClause.text;
  }

  async improveText(text: string, instruction: string): Promise<string> {
    if (USE_MOCK) {
      return mockAIService.improveText(text, instruction);
    }

    const query = `
      mutation ImproveText($text: String!, $instruction: String!) {
        improveText(text: $text, instruction: $instruction) {
          improvedText
        }
      }
    `;

    const response = await gql(query, { text, instruction });
    return response.improveText.improvedText;
  }

  async generalReview(documentText: string): Promise<Array<{
    issue: string;
    severity: 'high' | 'medium' | 'low';
    location: string;
    recommendation: string;
  }>> {
    if (USE_MOCK) {
      return mockAIService.generalReview(documentText);
    }

    const query = `
      mutation GeneralReview($documentText: String!) {
        generalReview(documentText: $documentText) {
          issues {
            issue
            severity
            location
            recommendation
          }
        }
      }
    `;

    const response = await gql(query, { documentText });
    return response.generalReview.issues;
  }
}

export const aiService = new AIService();