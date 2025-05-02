import { NowRequest, NowResponse } from '@vercel/node';

export default async function handler(req: NowRequest, res: NowResponse) {
  // Example response for popular TV shows endpoint
  res.status(200).json({
    message: 'Popular TV shows'
  });
}