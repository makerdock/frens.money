// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { validateAndResolveAddress } from '../../utils/crypto';

type Data = {
  name?: string | null
  address?: string | null
  error?: string | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // get wallet name from query
    const name = req.query.name as string

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MORALIS_SERVER_URL);

    const ensResponse = await validateAndResolveAddress(name, provider)
    res.status(200).json({ name: ensResponse?.name, address: ensResponse?.address })
  } catch (error) {
    res.status(404).json({ error: (error as any).message })
  }
}
