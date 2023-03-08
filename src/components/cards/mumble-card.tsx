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
import { MumbleType, UserType } from '../../types/public-api';

export enum MumbleCardVariant {
  detailpage = 'detailpage',
  response = 'response',
  timeline = 'timeline',
}

type MumbleCardProps = {
  variant: MumbleCardVariant;
  mumble: MumbleType;
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

//TODO Define state for like counter, handle the like click and pass a callback for handling the like click
export const MumbleCard: FC<MumbleCardProps> = ({ variant, mumble }) => {
  const settings = mumbleCardVariantMap[variant] || mumbleCardVariantMap.detailpage;

  // If the creator is not resolved (no session/token) have to anonymize the user here
  if (typeof mumble.creator === 'string') {
    const anonymUser: UserType = {
      id: mumble.creator,
      userName: 'anonym',
      lastName: '',
      firstName: '',
      displayName: '',
    };
    mumble.creator = anonymUser;
  }

  return (
    <Card borderRadiusType={settings.borderRadiusType} isInteractive={settings.isInteractive}>
      {variant != MumbleCardVariant.response && (
        <div className="absolute -left-l">
          <ProfilePicture alt={mumble.creator.userName} size={settings.profilePictureSize} src={mumble.creator.avatarUrl} />
        </div>
      )}
      <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
        {variant != MumbleCardVariant.response ? (
          <UserShortRepresentation
            displayName={mumble.creator.userName != 'anonym' ? mumble.creator.displayName : ''}
            hrefProfile={mumble.creator.userName != 'anonym' ? mumble.creator.profileUrl : '/login'}
            labelType={settings.userShortRepresentationLabelType}
            timestamp={mumble.createdAt}
            username={mumble.creator.userName}
          />
        ) : (
          <UserShortRepresentation
            alt={mumble.creator.userName}
            displayName={mumble.creator.userName != 'anonym' ? mumble.creator.displayName : ''}
            hrefProfile={mumble.creator.userName != 'anonym' ? mumble.creator.profileUrl : '/login'}
            labelType={settings.userShortRepresentationLabelType}
            profilePictureSize={settings.userShortRepresentationProfilePictureSize}
            src={mumble.creator.avatarUrl || ''}
            timestamp={mumble.createdAt}
            username={mumble.creator.userName}
          />
        )}
        <div className="text-slate-900">
          <Paragraph size={settings.textSize}>{mumble.text}</Paragraph>
        </div>
        <ImageContainer
          alt={mumble.text}
          onClick={function noRefCheck() {
            console.log('click');
          }}
          src={mumble.mediaUrl}
        />
        <Stack spacing={StackSpacing.m}>
          <Reply
            onClick={function noRefCheck() {
              console.log('click');
            }}
            repliesCount={mumble.replyCount}
            withReaction
          />
          <Like
            likesCount={mumble.likeCount}
            onClick={function noRefCheck() {
              console.log('click');
            }}
            withReaction
          />
          <Share linkToCopy="https://www.fcsg.ch/" />
        </Stack>
      </Stack>
    </Card>
  );
};
