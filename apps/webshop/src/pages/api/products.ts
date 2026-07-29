import type { NextApiRequest, NextApiResponse } from 'next';

const INTERNAL_GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://localhost:4000/graphql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(INTERNAL_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch {
    return res.status(502).json({ errors: [{ message: 'Upstream GraphQL request failed' }] });
  }
}
