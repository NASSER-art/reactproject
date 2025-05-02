import { NowRequest, NowResponse } from '@vercel/node';

export default async function handler(req: NowRequest, res: NowResponse) {
  // Example response for popular movies endpoint
  res.status(200).json({
    message: 'Popular movies'
  });
}