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
import Link from 'next/link';

export enum WriteCardVariant {
  inline = 'inline',
  main = 'main', // todo: besserer Name wie main für die Variant finden
}

// todo: eigene Typen
// todo: Frage: Ist ein Context für die Übergabe des States schöner?
type WriteCardProps = {
  form?: {
    text: string;
  };
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
export const WriteCard: FC<WriteCardProps> = ({ form, variant, handleChange, handleSubmit }) => {
  const settings = writeCardVariantMap[variant] || writeCardVariantMap.inline;
  const { data: session } = useSession();

  return (
    session && (
      <Card borderRadiusType={settings.borderRadiusType} isInteractive={settings.isInteractive}>
        {variant === WriteCardVariant.main && (
          <div className="absolute -left-l top-m">
            <ProfilePicture alt={session.user.username} size={ProfilePictureSize.m} src={session.user.avatarUrl} />
          </div>
        )}
        <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
          {variant === WriteCardVariant.main && <Heading headingLevel={HeadingSize.h4}>Hey, was läuft?</Heading>}

          {variant === WriteCardVariant.inline && (
            <UserShortRepresentation
              alt={session.user.username}
              displayName={`${session.user.firstname} ${session?.user.lastname}`}
              hrefProfile={`../profile/${session.user.id}`}
              labelType={UserShortRepresentationLabelType.m}
              linkComponent={Link}
              profilePictureSize={UserShortRepresentationProfilePictureSize.s}
              src={session.user.avatarUrl ?? ''}
              username={session.user.username}
            />
            /* todo: Typ des src Props prüfen. avatarUrl ist aktuell nullable. Es muss jedoch zwingend eine src angegeben werden */
            /* todo: Muss der Displayname hier nochmals zusammengesetzt werden? */
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
              value={form?.text || ''}
            />

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
          </Form>
        </Stack>
      </Card>
    )
  );
};
