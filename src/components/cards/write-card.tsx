import {
  BorderRadiusType,
  Card,
  Form,
  Heading,
  HeadingSize,
  IconUpload,
  ProfilePicture,
  ProfilePictureSize,
  Stack,
  StackDirection,
  StackSpacing,
  Textarea,
  TextButton,
  TextButtonColor,
  TextButtonDisplayMode,
  TextButtonSize,
  UserShortRepresentation,
  UserShortRepresentationLabelType,
  UserShortRepresentationProfilePictureSize,
} from '@smartive-education/design-system-component-library-team-ost';
import { useSession } from 'next-auth/react';
import { ChangeEvent, FC, FormEvent } from 'react';

export enum WriteCardVariant {
  inline = 'inline',
  main = 'main',
}

type WriteCardProps = {
  variant: WriteCardVariant;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

type WriteCardVariantMap = {
  borderRadiusType: BorderRadiusType;
  isInteractive: boolean;
};

const writeCardVariantMap: Record<WriteCardVariant, WriteCardVariantMap> = {
  inline: {
    borderRadiusType: BorderRadiusType.none,
    isInteractive: false,
  },
  main: {
    borderRadiusType: BorderRadiusType.roundedFull,
    isInteractive: false,
  },
};

//TODO Form handling und Bildupload-Modal integration
export const WriteCard: FC<WriteCardProps> = ({ variant, handleChange, handleSubmit }) => {
  const settings = writeCardVariantMap[variant] || writeCardVariantMap.inline;
  const { data: session } = useSession();

  return (
    session && (
      <Card borderRadiusType={settings.borderRadiusType} isInteractive={settings.isInteractive}>
        {variant === WriteCardVariant.main && (
          <div className="absolute -left-l top-m">
            <ProfilePicture
              alt={session?.user.username as string}
              size={ProfilePictureSize.m}
              src={session?.user.avatarUrl as string}
            />
          </div>
        )}
        <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
          {variant === WriteCardVariant.main && <Heading headingLevel={HeadingSize.h4}>Hey, was läuft?</Heading>}

          {variant === WriteCardVariant.inline && (
            <UserShortRepresentation
              alt={session.user.username as string}
              displayName={`${session.user.firstname} ${session?.user.lastname}`}
              hrefProfile="#"
              labelType={UserShortRepresentationLabelType.m}
              username={session.user.username as string}
              profilePictureSize={UserShortRepresentationProfilePictureSize.s}
              src={session.user.avatarUrl as string}
            />
          )}

          <Form handleSubmit={handleSubmit}>
            <Textarea
              ariaLabel="Und was meinst du dazu?"
              errorMessage=""
              name="text"
              onChange={handleChange}
              placeholder="Und was meinst du dazu?"
              required
              rows={5}
              value=""
            />
          </Form>

          <Stack spacing={StackSpacing.s}>
            <TextButton
              color={TextButtonColor.slate}
              displayMode={TextButtonDisplayMode.fullWidth}
              icon={<IconUpload />}
              onClick={() => console.log('bild upload click')}
              size={TextButtonSize.m}
            >
              Bild hochladen
            </TextButton>
            <TextButton
              color={TextButtonColor.violet}
              displayMode={TextButtonDisplayMode.fullWidth}
              icon={<IconUpload />}
              onClick={() => console.log('absenden click')}
              size={TextButtonSize.m}
              type="submit"
            >
              Absenden
            </TextButton>
          </Stack>
        </Stack>
      </Card>
    )
  );
};
