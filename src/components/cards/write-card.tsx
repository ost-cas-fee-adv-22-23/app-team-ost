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
import { ChangeEvent, FC, FormEvent, useState } from 'react';
import Link from 'next/link';
import { FileuploadModal } from '../modals/fileupload-modal';

export enum WriteCardVariant {
  inline = 'inline',
  main = 'main', // todo: besserer Name wie main für die Variant finden
}

// todo: eigene Typen
// todo: Frage: Ist ein Context für die Übergabe des States schöner?
type WriteCardProps = {
  form: {
    textinput: string;
  };
  variant: WriteCardVariant;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (file: File) => void;
  file: File | null;
  fileInputError: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
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

export const WriteCard: FC<WriteCardProps> = ({
  form,
  variant,
  handleChange,
  handleFileChange,
  file,
  fileInputError,
  handleSubmit,
  isSubmitting,
}) => {
  const settings = writeCardVariantMap[variant] || writeCardVariantMap.inline;
  const { data: session } = useSession();
  const [isOpenFileUpload, setIsOpenFileUpload] = useState(false);

  const submitClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit click');
  };

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
              value={form.textinput}
              disabled={isSubmitting}
            />

            <Stack spacing={StackSpacing.s}>
              <TextButton
                color={TextButtonColor.slate}
                displayMode={TextButtonDisplayMode.fullWidth}
                icon={<IconUpload />}
                onClick={() => setIsOpenFileUpload(true)}
                size={TextButtonSize.m}
                type="button"
              >
                Bild hochladen
              </TextButton>
              <TextButton
                color={TextButtonColor.violet}
                displayMode={TextButtonDisplayMode.fullWidth}
                icon={<IconUpload />}
                onClick={() => submitClick}
                size={TextButtonSize.m}
                type="submit"
              >
                Absenden
              </TextButton>
            </Stack>
          </Form>
        </Stack>
        <FileuploadModal
          handleChange={handleFileChange}
          isOpen={isOpenFileUpload}
          setIsOpen={setIsOpenFileUpload}
          file={file}
          fileInputError={fileInputError}
        />
      </Card>
    )
  );
};
