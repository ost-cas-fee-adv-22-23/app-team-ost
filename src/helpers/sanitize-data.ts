import xss from 'xss';

export const sanitizeData = (text: string) => ({
  __html: xss(text, {
    whiteList: { a: ['href', 'class'] },
    stripIgnoreTag: true,
  }),
});
