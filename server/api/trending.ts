import { NowRequest, NowResponse } from '@vercel/node';

export default async function handler(req: NowRequest, res: NowResponse) {
  const { mediaType, timeWindow } = req.query;

  // Example response for trending endpoint
  res.status(200).json({
    message: `Trending ${mediaType} for ${timeWindow}`
  });
}