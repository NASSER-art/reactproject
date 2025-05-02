import { NowRequest, NowResponse } from '@vercel/node';

export default async function handler(req: NowRequest, res: NowResponse) {
  const { query } = req.query;

  // Example response for movie search endpoint
  res.status(200).json({
    message: `Search results for movie query: ${query}`
  });
}