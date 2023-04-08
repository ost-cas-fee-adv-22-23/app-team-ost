import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const pathToRevalidate = req.query.pathToRevalidate;
  if (typeof pathToRevalidate === 'string') {
    try {
      // this should be the actual path not a rewritten path
      // e.g. for "/mumble/[slug]" this should be "/mumble/01GWVG8KYB45EEPVN4G14E0V2P"
      await res.revalidate(pathToRevalidate);
      return res.json({ revalidated: true });
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send('Error revalidating');
    }
  } else {
    return res.status(403).send('Forbidden');
  }
}
