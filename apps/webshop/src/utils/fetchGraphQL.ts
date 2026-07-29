const INTERNAL_GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://localhost:4000/graphql';
const CLIENT_GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/products';

function resolveEndpoint(): string {
  return typeof window === 'undefined' ? INTERNAL_GRAPHQL_URL : CLIENT_GRAPHQL_URL;
}

export async function fetchGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  init?: { signal?: AbortSignal }
): Promise<T> {
  const response = await fetch(resolveEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal: init?.signal,
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}
