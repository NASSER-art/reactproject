import { NowRequest, NowResponse } from '@vercel/node';

export default async function handler(req: NowRequest, res: NowResponse) {
  const { id } = req.query;

  // Example response for movie details endpoint
  res.status(200).json({
    message: `Details for movie ID: ${id}`
  });
}