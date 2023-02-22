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
import { MumbleType } from '../../types/public-api';

export enum MumbleCardVariant {
  detailpage = 'detailpage',
  response = 'response',
  timeline = 'timeline',
}

type MumbleCardProps = {
  variant: MumbleCardVariant;
  mumble: MumbleType;
};

type MumbleCardVariantMapType = {
  borderRadiusType: BorderRadiusType;
  isInteractive: boolean;
  profilePictureSize: ProfilePictureSize;
  textSize: ParagraphSize;
  userShortRepresentationLabelType: UserShortRepresentationLabelType;
  userShortRepresentationProfilePictureSize: UserShortRepresentationProfilePictureSize;
};

const contentCardvariantMap: Record<MumbleCardVariant, MumbleCardVariantMapType> = {
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
  const setting = contentCardvariantMap[variant] || contentCardvariantMap.detailpage;

  return (
    <Card borderRadiusType={setting.borderRadiusType} isInteractive={setting.isInteractive}>
      {!MumbleCardVariant.response && (
        <div className="absolute -left-l">
          <ProfilePicture alt={mumble.creator.userName} size={setting.profilePictureSize} src={mumble.creator.avatarUrl} />
        </div>
      )}
      <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
        {MumbleCardVariant.response ? (
          <UserShortRepresentation
            displayName={`${mumble.creator.firstName} ${mumble.creator.lastName}`}
            hrefProfile="#"
            labelType={setting.userShortRepresentationLabelType}
            timestamp="vor 42 Minuten"
            username={mumble.creator.userName}
          />
        ) : (
          <UserShortRepresentation
            alt={mumble.creator.userName}
            displayName={`${mumble.creator.firstName} ${mumble.creator.lastName}`}
            hrefProfile="#"
            labelType={setting.userShortRepresentationLabelType}
            profilePictureSize={setting.userShortRepresentationProfilePictureSize}
            src={mumble.creator.avatarUrl!}
            timestamp="vor 42 Minuten"
            username={mumble.creator.userName}
          />
        )}
        <div className="text-slate-900">
          <Paragraph size={setting.textSize}>{mumble.text}</Paragraph>
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
