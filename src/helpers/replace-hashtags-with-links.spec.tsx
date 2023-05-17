import { replaceHashtagsWithLinks } from '@/helpers/replace-hashtags-with-links';

describe('ReplaceHashtagsWithLinks', () => {
  it('should return same text in a span element if no hashtag exists', () => {
    // ARRANGE
    const text = 'This is a text without hashtag.';

    // ACT
    const result = replaceHashtagsWithLinks(text);

    // ASSERT
    expect(result.length).toBe(1);
    expect(result[0].props.children).toBe(text);
  });

  it('should return hashtag in a TextLink if whole text is a single hashtag', () => {
    // ARRANGE
    const text = '#ThisIsATextWithASingleHashtag';

    // ACT
    const result = replaceHashtagsWithLinks(text);

    // ASSERT
    expect(result.length).toBe(1);
    expect(result[0].props.children).toBe(text);
  });

  it('should replace hashtag with link in the middle of a text', () => {
    // ARRANGE
    const text = 'This is a text with a #hashtag. There is more text.';

    // ACT
    const result = replaceHashtagsWithLinks(text);

    // ASSERT
    expect(result.length).toBe(3);
    expect(result[1].props.children).toBe('#hashtag');
  });

  it('should replace hashtag which contains numbers', () => {
    // ARRANGE
    const text = 'This is a text with a #hash42tag. There is more text.';

    // ACT
    const result = replaceHashtagsWithLinks(text);

    // ASSERT
    expect(result.length).toBe(3);
    expect(result[1].props.children).toBe('#hash42tag');
  });

  it('should replace hashtag which contains lower and uppercase letters', () => {
    // ARRANGE
    const text = 'This is a text with a #HaShTaG. There is more text.';

    // ACT
    const result = replaceHashtagsWithLinks(text);

    // ASSERT
    expect(result.length).toBe(3);
    expect(result[1].props.children).toBe('#HaShTaG');
  });
});
