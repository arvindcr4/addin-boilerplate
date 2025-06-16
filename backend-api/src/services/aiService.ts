import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

// Types
interface AnalysisOptions {
  stance?: 'customer' | 'provider' | 'neutral';
  tone?: 'formal' | 'casual' | 'professional';
  jurisdiction?: string;
}

interface AnalysisRequest {
  text: string;
  type: 'review' | 'suggest' | 'draft' | 'revise';
  options?: AnalysisOptions;
}

// Mock AI Service (replace with OpenAI in production)
export class AIService {
  static async analyzeText(request: AnalysisRequest) {
    logger.info(`Analyzing text: ${request.type}`);
    
    // Simulate AI processing time
    await this.simulateDelay(1000, 2000);

    // Mock responses based on type
    switch (request.type) {
      case 'review':
        return this.mockReview(request.text);
      case 'suggest':
        return this.mockSuggestions(request.text, request.options);
      case 'draft':
        return this.mockDraft(request.text);
      case 'revise':
        return this.mockRevise(request.text);
      default:
        throw new Error('Invalid analysis type');
    }
  }

  static async askQuestion(documentText: string, question: string) {
    logger.info(`Answering question: ${question}`);
    await this.simulateDelay(800, 1200);

    // Mock intelligent responses based on keywords
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('termination')) {
      return {
        answer: 'Based on the document, the termination clause allows either party to end the agreement with 30 days written notice. The agreement also includes provisions for immediate termination in cases of material breach.',
        relevantExcerpts: [
          'Either party may terminate this Agreement upon thirty (30) days written notice...',
          'In the event of a material breach, the non-breaching party may terminate immediately...'
        ],
      };
    }
    
    if (lowerQuestion.includes('payment') || lowerQuestion.includes('invoice')) {
      return {
        answer: 'The payment terms specify that invoices are due within 30 days of receipt. Late payments incur a 1.5% monthly interest charge.',
        relevantExcerpts: [
          'Payment shall be due within thirty (30) days of invoice date...',
          'Late payments shall accrue interest at a rate of 1.5% per month...'
        ],
      };
    }

    if (lowerQuestion.includes('confidential')) {
      return {
        answer: 'The confidentiality provisions protect all non-public information shared between parties. The obligations survive termination for a period of 5 years.',
        relevantExcerpts: [
          'All Confidential Information shall be maintained in strict confidence...',
          'Confidentiality obligations shall survive termination for five (5) years...'
        ],
      };
    }

    // Default response
    return {
      answer: `Based on my analysis of the document regarding "${question}", I recommend reviewing the specific sections that address this topic. The document contains comprehensive provisions that should be carefully considered in context.`,
      relevantExcerpts: [],
    };
  }

  static async draftClause(clauseType: string, context: string) {
    logger.info(`Drafting clause: ${clauseType}`);
    await this.simulateDelay(1000, 1500);

    const clauses: Record<string, string> = {
      'confidentiality': `CONFIDENTIALITY. The receiving party acknowledges that it may have access to information that is confidential to the disclosing party ("Confidential Information"). The receiving party agrees that it shall not disclose to any third parties or use for its own benefit any Confidential Information without the prior written consent of the disclosing party. This obligation shall survive the termination of this Agreement for a period of five (5) years.`,
      
      'termination': `TERMINATION. This Agreement may be terminated: (a) by either party upon thirty (30) days written notice to the other party; (b) immediately by either party upon a material breach by the other party that remains uncured for ten (10) days after written notice; or (c) by mutual written consent of the parties. Upon termination, all rights and obligations shall cease except for those that by their nature survive termination.`,
      
      'indemnification': `INDEMNIFICATION. Each party shall indemnify, defend, and hold harmless the other party and its officers, directors, employees, and agents from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or resulting from: (a) any breach of this Agreement by the indemnifying party; (b) any negligent or wrongful act or omission of the indemnifying party; or (c) any violation of applicable law by the indemnifying party.`,
      
      'liability': `LIMITATION OF LIABILITY. Except for breaches of confidentiality, indemnification obligations, or gross negligence or willful misconduct, in no event shall either party be liable for any indirect, incidental, special, exemplary, punitive, or consequential damages, regardless of the theory of liability, even if advised of the possibility of such damages. Each party's total liability under this Agreement shall not exceed the total amount paid or payable under this Agreement in the twelve (12) months preceding the claim.`,
      
      'warranty': `WARRANTY. Each party represents and warrants that: (a) it has full corporate right, power, and authority to enter into this Agreement; (b) the execution of this Agreement has been duly authorized; (c) the person executing this Agreement on behalf of each party is duly authorized; and (d) this Agreement constitutes the legal, valid, and binding obligation of such party, enforceable in accordance with its terms.`,
      
      'force-majeure': `FORCE MAJEURE. Neither party shall be liable for any failure or delay in performing its obligations under this Agreement if such failure or delay results from circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemic, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.`,
    };

    const clause = clauses[clauseType.toLowerCase().replace(/\s+/g, '-')] || 
      `CUSTOM PROVISION. [This is a custom ${clauseType} clause tailored to your specific needs. Please review and modify as necessary to ensure it aligns with your agreement's context and applicable law.]`;

    return { text: clause };
  }

  static async improveText(text: string, instruction: string) {
    logger.info(`Improving text with instruction: ${instruction}`);
    await this.simulateDelay(500, 800);

    const lowerInstruction = instruction.toLowerCase();
    let improvedText = text;

    if (lowerInstruction.includes('concise') || lowerInstruction.includes('brief')) {
      // Make more concise
      improvedText = text
        .replace(/\s+/g, ' ')
        .replace(/\b(in order to|for the purpose of)\b/gi, 'to')
        .replace(/\b(at this point in time|at the present time)\b/gi, 'now')
        .replace(/\b(due to the fact that)\b/gi, 'because')
        .replace(/\b(in the event that)\b/gi, 'if')
        .trim();
      
      if (improvedText.length > 200) {
        improvedText = improvedText.substring(0, 197) + '...';
      }
    } else if (lowerInstruction.includes('formal') || lowerInstruction.includes('professional')) {
      // Make more formal
      improvedText = text
        .replace(/\bcan't\b/g, 'cannot')
        .replace(/\bwon't\b/g, 'will not')
        .replace(/\bI'll\b/g, 'I will')
        .replace(/\bwe'll\b/g, 'we will')
        .replace(/\bthey'll\b/g, 'they will')
        .replace(/\byou'll\b/g, 'you will')
        .replace(/\bI'm\b/g, 'I am')
        .replace(/\bit's\b/g, 'it is')
        .replace(/\bthat's\b/g, 'that is');
    } else if (lowerInstruction.includes('clear') || lowerInstruction.includes('simple')) {
      // Simplify language
      improvedText = text
        .replace(/\butilize\b/gi, 'use')
        .replace(/\bcommence\b/gi, 'start')
        .replace(/\bterminate\b/gi, 'end')
        .replace(/\bpurchase\b/gi, 'buy')
        .replace(/\badditionally\b/gi, 'also')
        .replace(/\bsubsequently\b/gi, 'then');
    }

    return { improvedText };
  }

  static async generalReview(documentText: string) {
    logger.info('Performing general document review');
    await this.simulateDelay(1500, 2500);

    const issues = [];

    // Check for common issues
    if (!documentText.toLowerCase().includes('governing law')) {
      issues.push({
        issue: 'Missing governing law clause',
        severity: 'high',
        location: 'End of document',
        recommendation: 'Add a governing law clause specifying which jurisdiction\'s laws will govern the agreement and where disputes will be resolved.',
      });
    }

    if (!documentText.toLowerCase().includes('entire agreement')) {
      issues.push({
        issue: 'Missing entire agreement clause',
        severity: 'medium',
        location: 'End of document',
        recommendation: 'Include an entire agreement clause to prevent claims based on prior negotiations or side agreements.',
      });
    }

    if (documentText.toLowerCase().includes('shall') && documentText.toLowerCase().includes('will')) {
      issues.push({
        issue: 'Inconsistent use of "shall" and "will"',
        severity: 'low',
        location: 'Throughout document',
        recommendation: 'Choose either "shall" or "will" and use consistently throughout the document for clarity.',
      });
    }

    if (!documentText.toLowerCase().includes('notice')) {
      issues.push({
        issue: 'Missing notice provision',
        severity: 'medium',
        location: 'General provisions section',
        recommendation: 'Add a notice clause specifying how parties should communicate official notices (address, email, etc.).',
      });
    }

    if (documentText.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/)) {
      issues.push({
        issue: 'Hard-coded dates found',
        severity: 'low',
        location: 'Various sections',
        recommendation: 'Consider using relative dates (e.g., "30 days after...") instead of hard-coded dates for flexibility.',
      });
    }

    // Always return at least one issue for demo purposes
    if (issues.length === 0) {
      issues.push({
        issue: 'Document structure could be improved',
        severity: 'low',
        location: 'Overall document',
        recommendation: 'Consider adding clear section headings and numbering for better organization and reference.',
      });
    }

    return { issues };
  }

  // Helper methods
  private static mockReview(text: string) {
    return {
      suggestions: [
        {
          id: uuidv4(),
          type: 'modification',
          originalText: 'shall',
          suggestedText: 'will',
          explanation: 'Modern legal drafting prefers "will" over "shall" for clarity.',
          confidence: 0.85,
        },
        {
          id: uuidv4(),
          type: 'addition',
          suggestedText: ', subject to applicable law',
          explanation: 'Adding this qualifier ensures compliance with mandatory legal requirements.',
          confidence: 0.75,
        },
      ],
      summary: 'Document review complete. Found opportunities to modernize language and ensure legal compliance.',
    };
  }

  private static mockSuggestions(text: string, options?: AnalysisOptions) {
    const stance = options?.stance || 'neutral';
    
    return {
      suggestions: [
        {
          id: uuidv4(),
          type: 'modification',
          originalText: 'best efforts',
          suggestedText: stance === 'customer' ? 'commercially reasonable efforts' : 'reasonable efforts',
          explanation: `"${stance === 'customer' ? 'Commercially reasonable' : 'Reasonable'} efforts" provides a more balanced standard than "best efforts".`,
          confidence: 0.9,
        },
        {
          id: uuidv4(),
          type: 'addition',
          suggestedText: 'including but not limited to',
          explanation: 'This phrase ensures the list is non-exhaustive and provides flexibility.',
          confidence: 0.8,
        },
      ],
      summary: `Analysis complete with ${stance} stance perspective.`,
    };
  }

  private static mockDraft(text: string) {
    return {
      suggestions: [],
      summary: 'New clause drafted based on context.',
    };
  }

  private static mockRevise(text: string) {
    return {
      suggestions: [
        {
          id: uuidv4(),
          type: 'modification',
          originalText: text.substring(0, 50),
          suggestedText: 'Revised: ' + text.substring(0, 50),
          explanation: 'Text revised for clarity and precision.',
          confidence: 0.85,
        },
      ],
      summary: 'Revision complete.',
    };
  }

  private static simulateDelay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}