// Lightweight helpers for Office AI Assistant backend calls
// Uses fetch with credentials included.

const BASE_API = process.env.NODE_ENV === 'production' 
  ? "https://api.yourcompany.com" 
  : "http://localhost:4000";
const BASE_ANALYTICS = "https://analytics.yourcompany.com";
const BASE_INSIGHTS = "https://insights.yourcompany.com";

export async function gql(query, variables = {}) {
  // Get token from localStorage
  const token = localStorage.getItem('office-ai-token');
  
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_API}/graphql`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ query, variables }),
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || `GraphQL error ${res.status}`);
  }
  
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  
  return data.data;
}

export async function postFeedback(data) {
  return fetch(`${BASE_INSIGHTS}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
}

export async function getOnboarding(flowId) {
  return fetch(`${BASE_ANALYTICS}/flows/${flowId}`, {
    credentials: "include",
  }).then(r => r.json());
}
