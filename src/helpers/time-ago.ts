/*
 * Transforms a date iso string to a string that represents how log ago the date was
 */
export const timeAgo = (dateAsIsoString: string): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(dateAsIsoString).getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes ago`;
  }

  if (seconds < 10) return 'just now';

  return Math.floor(seconds) + ' seconds ago';
};
