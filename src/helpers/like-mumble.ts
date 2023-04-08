import { Mumble } from '@/types/mumble';

/**
 * Handle a like or dislike on a mumble
 * @param Mumble The mumble to like or dislike
 */
export const onLikeClick = async (mumble: Mumble) => {
  // errorhandling?
  const res = await fetch(`/api/posts/${mumble.id}/like`, { method: mumble.likedByUser ? 'DELETE' : 'PUT' });
  if (res.status === 204) {
    console.warn('work');
  } else {
    console.warn('error');
  }
};
