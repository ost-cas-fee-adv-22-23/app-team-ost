import {
  BorderRadiusType,
  Card,
  ImageContainer,
  Like,
  Paragraph,
  ParagraphSize,
  ProfilePicture,
  ProfilePictureSize,
  Reply,
  Share,
  Stack,
  StackDirection,
  StackSpacing,
  UserShortRepresentation,
  UserShortRepresentationLabelType,
  UserShortRepresentationProfilePictureSize,
} from '@smartive-education/design-system-component-library-team-ost';
import { FC } from 'react';
import { Mumble } from '../../types/mumble';
import Link from 'next/link';
import Image from 'next/image';
import { timeAgo } from '../../helpers/time-ago';

const BASE_URL = process.env.NEXT_PUBLIC_URL;

// todo: bessere Namen für Variants. Evtl. eigene Components für Variants erstellen
export enum MumbleCardVariant {
  detailpage = 'detailpage',
  response = 'response',
  timeline = 'timeline',
}

type MumbleCardProps = {
  variant: MumbleCardVariant;
  mumble: Mumble;
  onLikeClick: (mumble: Mumble) => void;
};

type MumbleCardVariantMap = {
  borderRadiusType: BorderRadiusType;
  isInteractive: boolean;
  profilePictureSize: ProfilePictureSize;
  textSize: ParagraphSize;
  userShortRepresentationLabelType: UserShortRepresentationLabelType;
  userShortRepresentationProfilePictureSize: UserShortRepresentationProfilePictureSize;
};

const mumbleCardVariantMap: Record<MumbleCardVariant, MumbleCardVariantMap> = {
  detailpage: {
    borderRadiusType: BorderRadiusType.roundedTop,
    isInteractive: false,
    profilePictureSize: ProfilePictureSize.m,
    textSize: ParagraphSize.l,
    userShortRepresentationLabelType: UserShortRepresentationLabelType.l,
    userShortRepresentationProfilePictureSize: UserShortRepresentationProfilePictureSize.s,
  },
  response: {
    borderRadiusType: BorderRadiusType.none,
    isInteractive: false,
    profilePictureSize: ProfilePictureSize.s,
    textSize: ParagraphSize.m,
    userShortRepresentationLabelType: UserShortRepresentationLabelType.s,
    userShortRepresentationProfilePictureSize: UserShortRepresentationProfilePictureSize.s,
  },
  timeline: {
    borderRadiusType: BorderRadiusType.roundedFull,
    isInteractive: true,
    profilePictureSize: ProfilePictureSize.m,
    textSize: ParagraphSize.m,
    userShortRepresentationLabelType: UserShortRepresentationLabelType.m,
    userShortRepresentationProfilePictureSize: UserShortRepresentationProfilePictureSize.s,
  },
};

export const MumbleCard: FC<MumbleCardProps> = ({ variant, mumble, onLikeClick }) => {
  const settings = mumbleCardVariantMap[variant] || mumbleCardVariantMap.detailpage;

  return (
    <Card borderRadiusType={settings.borderRadiusType} isInteractive={settings.isInteractive}>
      {variant !== MumbleCardVariant.response && (
        <div className="absolute -left-l">
          <ProfilePicture
            alt={mumble.creator.userName}
            imageComponent={Image}
            width={80}
            height={80}
            size={settings.profilePictureSize}
            src={mumble.creator.avatarUrl}
          />
        </div>
      )}

      <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
        {variant !== MumbleCardVariant.response ? (
          <UserShortRepresentation
            displayName={mumble.creator.displayName}
            hrefProfile={mumble.creator.profileUrl}
            labelType={settings.userShortRepresentationLabelType}
            linkComponent={Link}
            timestamp={timeAgo(mumble.createdAt)}
            username={mumble.creator.userName}
          />
        ) : (
          <UserShortRepresentation
            alt={mumble.creator.userName}
            displayName={mumble.creator.displayName}
            hrefProfile={mumble.creator.profileUrl}
            imageComponent={Image}
            imageComponentArgs={{ width: 50, height: 50 }}
            labelType={settings.userShortRepresentationLabelType}
            linkComponent={Link}
            profilePictureSize={settings.userShortRepresentationProfilePictureSize}
            src={mumble.creator.avatarUrl || ''}
            timestamp={timeAgo(mumble.createdAt)}
            username={mumble.creator.userName}
          />
        )}
        <div className="text-slate-900">
          <Paragraph size={settings.textSize}>{mumble.text}</Paragraph>
        </div>
        {mumble.mediaUrl !== null && (
          <ImageContainer
            alt={mumble.text}
            imageComponent={Image}
            fill
            priority
            sizes="(max-width: 640px) 100vw,
              50vw"
            onClick={function noRefCheck() {
              console.log('click');
            }}
            src={mumble.mediaUrl ?? ''}
          />
        )}
        <Stack spacing={StackSpacing.m}>
          <Reply
            href={`/mumble/${mumble.id}`}
            linkComponent={Link}
            repliesCount={mumble.replyCount ?? 0}
            withReaction={(mumble.replyCount ?? 0) > 0}
          />
          <Like likesCount={mumble.likeCount} onClick={() => onLikeClick(mumble)} withReaction={mumble.likedByUser} />
          <Share linkToCopy={`${BASE_URL}mumble/${mumble.id}`} />
        </Stack>
      </Stack>
    </Card>
  );
};
