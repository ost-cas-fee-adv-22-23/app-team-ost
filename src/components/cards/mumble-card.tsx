import { replaceHashtagsWithLinks } from '@/helpers/replace-hashtags-with-links';
import { timeAgo } from '@/helpers/time-ago';
import { LikeError } from '@/types/error';
import { Mumble } from '@/types/mumble';
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
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_URL;

export enum MumbleCardVariant {
  detail = 'detail',
  reply = 'reply',
  list = 'list',
}

type MumbleCardProps = {
  variant: MumbleCardVariant;
  mumble: Mumble;
  onLikeClick: (mumble: Mumble) => Promise<void>;
  isReplyActionVisible?: boolean;
  isLikeActionVisible?: boolean;
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
  detail: {
    borderRadiusType: BorderRadiusType.roundedTop,
    isInteractive: false,
    profilePictureSize: ProfilePictureSize.m,
    textSize: ParagraphSize.l,
    userShortRepresentationLabelType: UserShortRepresentationLabelType.l,
    userShortRepresentationProfilePictureSize: UserShortRepresentationProfilePictureSize.s,
  },
  reply: {
    borderRadiusType: BorderRadiusType.none,
    isInteractive: false,
    profilePictureSize: ProfilePictureSize.s,
    textSize: ParagraphSize.m,
    userShortRepresentationLabelType: UserShortRepresentationLabelType.s,
    userShortRepresentationProfilePictureSize: UserShortRepresentationProfilePictureSize.s,
  },
  list: {
    borderRadiusType: BorderRadiusType.roundedFull,
    isInteractive: true,
    profilePictureSize: ProfilePictureSize.m,
    textSize: ParagraphSize.m,
    userShortRepresentationLabelType: UserShortRepresentationLabelType.m,
    userShortRepresentationProfilePictureSize: UserShortRepresentationProfilePictureSize.s,
  },
};

export const MumbleCard: FC<MumbleCardProps> = ({
  isReplyActionVisible = false,
  isLikeActionVisible = false,
  variant,
  mumble,
  onLikeClick,
}) => {
  const settings = mumbleCardVariantMap[variant] || mumbleCardVariantMap.detail;

  const handleOnLikeClick = async (): Promise<void> => {
    try {
      await onLikeClick(mumble);
    } catch (error) {
      if (error instanceof LikeError) {
        setTimeout(() => {
          // todo: Hier könnte der ursprüngliche Zustand nach dem optimistic update wiederhergestellt werden.
        }, 5000);
      }
    }
  };

  return (
    <Card borderRadiusType={settings.borderRadiusType} isInteractive={settings.isInteractive}>
      {variant !== MumbleCardVariant.reply && (
        <div className="absolute -left-l" data-testid="profile-picture">
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
        {variant !== MumbleCardVariant.reply ? (
          <UserShortRepresentation
            data-testid="user-short-representation-not-reply"
            displayName={mumble.creator.displayName}
            hrefProfile={mumble.creator.profileUrl}
            labelType={settings.userShortRepresentationLabelType}
            linkComponent={Link}
            timestamp={timeAgo(mumble.createdAt)}
            username={mumble.creator.userName}
          />
        ) : (
          <UserShortRepresentation
            data-testid="user-short-representation-reply"
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
          <Paragraph data-testid="mumble-text" size={settings.textSize}>
            {replaceHashtagsWithLinks(mumble.text)}
          </Paragraph>
        </div>
        {mumble.mediaUrl !== null && (
          <ImageContainer
            data-testid="mumble-image"
            alt={mumble.text === ' ' ? 'mumble image' : mumble.text}
            imageComponent={Image}
            fill
            priority
            sizes="(max-width: 640px) 80vw, (max-width: 1536px) 50vw, 30vw"
            onClick={() => {
              console.log('open fullscreen');
            }}
            src={mumble.mediaUrl ?? ''}
          />
        )}
        <Stack
          direction={{
            default: StackDirection.col,
            sm: StackDirection.col,
            md: StackDirection.col,
            lg: StackDirection.row,
          }}
          spacing={StackSpacing.s}
        >
          {isReplyActionVisible && (
            <Reply
              data-testid="action-reply"
              href={`/mumble/${mumble.id}`}
              linkComponent={Link}
              repliesCount={mumble.replyCount ?? 0}
              withReaction={(mumble.replyCount ?? 0) > 0}
            />
          )}
          {isLikeActionVisible && (
            <Like
              data-testid="action-like"
              likesCount={mumble.likeCount}
              onClick={handleOnLikeClick}
              withReaction={mumble.likedByUser}
            />
          )}
          <Share data-testid="action-share" linkToCopy={`${BASE_URL}mumble/${mumble.id}`} />
        </Stack>
      </Stack>
    </Card>
  );
};
