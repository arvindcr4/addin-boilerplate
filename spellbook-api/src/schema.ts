export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
    refreshToken: String!
  }

  type Suggestion {
    id: ID!
    type: SuggestionType!
    originalText: String
    suggestedText: String
    explanation: String!
    confidence: Float!
  }

  type AnalysisResult {
    suggestions: [Suggestion!]!
    summary: String
  }

  type Issue {
    issue: String!
    severity: Severity!
    location: String!
    recommendation: String!
  }

  type ReviewResult {
    issues: [Issue!]!
  }

  type DraftResult {
    text: String!
  }

  type ImproveResult {
    improvedText: String!
  }

  type QuestionAnswer {
    answer: String!
    relevantExcerpts: [String!]
  }

  enum SuggestionType {
    addition
    deletion
    modification
    comment
  }

  enum Severity {
    high
    medium
    low
  }

  enum AnalysisType {
    review
    suggest
    draft
    revise
  }

  enum Stance {
    customer
    provider
    neutral
  }

  enum Tone {
    formal
    casual
    professional
  }

  input AnalysisOptions {
    stance: Stance
    tone: Tone
    jurisdiction: String
  }

  input AnalysisInput {
    text: String!
    type: AnalysisType!
    options: AnalysisOptions
  }

  type Query {
    currentUser: User
    health: String!
  }

  type Mutation {
    # Authentication
    login(email: String!, password: String!): AuthPayload!
    signup(email: String!, password: String!, name: String!): AuthPayload!
    refreshToken(refreshToken: String!): AuthPayload!
    logout: Boolean!

    # AI Operations
    analyzeText(input: AnalysisInput!): AnalysisResult!
    askQuestion(documentText: String!, question: String!): QuestionAnswer!
    draftClause(clauseType: String!, context: String!): DraftResult!
    improveText(text: String!, instruction: String!): ImproveResult!
    generalReview(documentText: String!): ReviewResult!
  }
`;