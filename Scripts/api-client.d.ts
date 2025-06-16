export function gql(query: string, variables?: Record<string, any>): Promise<any>;
export function postFeedback(data: any): Promise<Response>;
export function getOnboarding(flowId: string): Promise<any>;