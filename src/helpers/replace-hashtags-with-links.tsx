import { TextLink } from '@smartive-education/design-system-component-library-team-ost';
import Link from 'next/link';
import React from 'react';

const hashTagRegex = /(#\w+)/gm;

export const replaceHashtagsWithLinks = (text: string) => {
  const textArray = text.split(hashTagRegex);
  return textArray.map((textPart, index) => {
    if (hashTagRegex.test(textPart)) {
      return (
        <TextLink key={index} href={`/tag/${textPart.substring(1)}`} linkComponent={Link}>
          {textPart}
        </TextLink>
      );
    }
    return <span key={index}>{textPart}</span>;
  });
};
