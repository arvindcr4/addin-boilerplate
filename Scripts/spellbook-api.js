// Lightweight helpers for Spellbook backend calls
// Uses fetch with credentials included.

const BASE_API = process.env.NODE_ENV === 'production' 
  ? "https://api.spellbook.legal" 
  : "http://localhost:4000";
const BASE_FRIGADE = "https://frigade.spellbook.legal";
const BASE_INSIGHTS = "https://insights.spellbook.legal";

export async function gql(query, variables = {}) {
  // Get token from localStorage
  const token = localStorage.getItem('spellbook-token');
  
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
  return fetch(`${BASE_FRIGADE}/flows/${flowId}`, {
    credentials: "include",
  }).then(r => r.json());
}
