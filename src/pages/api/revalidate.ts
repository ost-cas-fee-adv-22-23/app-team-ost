import { HttpStatusCodes } from '@/types/http';
import type { NextApiRequest, NextApiResponse } from 'next';

/*
 * We could use this handler in the future for revalidate some isr page, like mumble-public/:id or timeline-public
 * after some experience with numbers of users, available server power / capacity, etc.
 * e.g. revalidate mumble-detail if there is a new reply or the like count has changed.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
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
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Error revalidating');
    }
  } else {
    return res.status(HttpStatusCodes.FORBIDDEN).send('Forbidden');
  }
}
