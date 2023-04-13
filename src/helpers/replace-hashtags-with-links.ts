const hashTagRegex = /#+([a-zA-Z0-9_]+)/gi;

// Leider kann kein JSX als innerHTML gesetzt werden. Daher wird die TextLink Component mittels a Tag nachgebaut.
// Zukünftig könnte ebenfalls noch die NextLink-Funktionalität (prefetch) mittels standard HTML nachgebaut werden.
export const replaceHashtagsWithLinks = (text: string) => {
  return text.replace(hashTagRegex, function (value): string {
    return (
      "<a href='/tag/" +
      value.substring(1) +
      "' class='text-violet-600 underline underline-offset-2 hover:decoration-violet-200 hover:underline-offset-4'>" +
      value +
      '</a>'
    );
  });
};
