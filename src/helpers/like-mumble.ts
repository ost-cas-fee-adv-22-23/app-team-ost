import { LikeError } from '@/types/error';
import { HttpStatusCodes } from '@/types/http';
import { Mumble } from '@/types/mumble';

/**
 * Handle a like or dislike on a mumble
 * @param mumble The mumble to like or dislike
 * @returns describes if the action was successful
 */
export const onLikeClick = async (mumble: Mumble): Promise<void> => {
  const res = await fetch(`/api/posts/${mumble.id}/like`, { method: mumble.likedByUser ? 'DELETE' : 'PUT' });

  if (res.status !== HttpStatusCodes.NO_CONTENT) {
    throw new LikeError(`failed to like/unlike mumble with id ${mumble.id}`);
  }
};
