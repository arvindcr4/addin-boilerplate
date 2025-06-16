// Mock service for development when API is not available

export const mockAuthService = {
  async login(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@spellbook.legal' && password === 'demo') {
      const user = {
        id: '1',
        email: 'demo@spellbook.legal',
        name: 'Demo User'
      };
      localStorage.setItem('spellbook-token', 'mock-token');
      localStorage.setItem('spellbook-user', JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid credentials');
  },

  async getCurrentUser() {
    const cachedUser = localStorage.getItem('spellbook-user');
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }
    throw new Error('Not authenticated');
  },

  async logout() {
    localStorage.removeItem('spellbook-token');
    localStorage.removeItem('spellbook-user');
  },

  async refreshToken() {
    // Mock refresh
    return;
  }
};

export const mockAIService = {
  async analyzeText(_request: any) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      suggestions: [
        {
          id: '1',
          type: 'modification' as const,
          originalText: 'shall',
          suggestedText: 'will',
          explanation: 'Using "will" instead of "shall" makes the language more modern and accessible.',
          confidence: 0.85
        },
        {
          id: '2',
          type: 'addition' as const,
          suggestedText: 'reasonable efforts',
          explanation: 'Adding "reasonable efforts" qualifier provides more balanced obligation.',
          confidence: 0.75
        }
      ],
      summary: 'Document analysis complete. Found 2 suggestions for improvement.'
    };
  },

  async askQuestion(_documentText: string, question: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses: Record<string, string> = {
      'default': 'Based on the document, I can help you with contract analysis, clause suggestions, and legal terminology explanations.',
      'termination': 'The termination clause typically allows either party to end the agreement with 30 days written notice.',
      'confidentiality': 'The confidentiality provisions protect sensitive information shared between the parties.',
    };
    
    const lowerQuestion = question.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerQuestion.includes(key)) {
        return value;
      }
    }
    
    return responses.default;
  },

  async draftClause(clauseType: string, _context: string) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const clauses: Record<string, string> = {
      'confidentiality': `Confidentiality. Each party acknowledges that it may have access to certain confidential information of the other party. Each party agrees to maintain the confidentiality of all such information and not to disclose it to any third party without the prior written consent of the disclosing party.`,
      'termination': `Termination. Either party may terminate this Agreement at any time by providing thirty (30) days' written notice to the other party. Upon termination, all rights and obligations of the parties under this Agreement shall cease, except for those provisions that by their nature survive termination.`,
      'liability': `Limitation of Liability. In no event shall either party be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with this Agreement, even if advised of the possibility of such damages.`,
      'default': `[Custom clause for ${clauseType}]`
    };
    
    return clauses[clauseType] || clauses.default;
  },

  async improveText(text: string, instruction: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple mock improvements
    let improved = text;
    
    if (instruction.toLowerCase().includes('concise')) {
      improved = text.replace(/\s+/g, ' ').trim();
      if (improved.length > 100) {
        improved = improved.substring(0, 100) + '...';
      }
    } else if (instruction.toLowerCase().includes('formal')) {
      improved = text.replace(/can't/g, 'cannot').replace(/won't/g, 'will not');
    }
    
    return improved;
  },

  async generalReview(_documentText: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return [
      {
        issue: 'Missing governing law clause',
        severity: 'high' as const,
        location: 'End of document',
        recommendation: 'Add a governing law clause specifying the jurisdiction and applicable law.'
      },
      {
        issue: 'Ambiguous payment terms',
        severity: 'medium' as const,
        location: 'Section 3.2',
        recommendation: 'Clarify payment schedule and late payment penalties.'
      },
      {
        issue: 'Inconsistent defined terms',
        severity: 'low' as const,
        location: 'Throughout document',
        recommendation: 'Ensure consistent capitalization of defined terms.'
      }
    ];
  }
};