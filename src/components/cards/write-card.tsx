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
import Image from 'next/image';
import { FileuploadModal } from '../modals/fileupload-modal';

export enum WriteCardVariant {
  inline = 'inline',
  main = 'main', // todo: besserer Name wie main für die Variant finden
}

// todo: eigene Typen
type WriteCardProps = {
  form: {
    textinputError: string;
    textinput: string;
    file: File | null;
  };
  variant: WriteCardVariant;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (file: File) => boolean;
  resetFileinputError: () => void;
  fileinputError: string;
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
  resetFileinputError,
  fileinputError,
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

  const fileUploadClick = () => {
    resetFileinputError();
    setIsOpenFileUpload(true);
  };

  return (
    session && (
      <Card borderRadiusType={settings.borderRadiusType} isInteractive={settings.isInteractive}>
        {variant === WriteCardVariant.main && (
          <div className="absolute -left-l top-m">
            <ProfilePicture
              alt={session.user.username}
              imageComponent={Image}
              width={80}
              height={80}
              size={ProfilePictureSize.m}
              src={session.user.avatarUrl}
            />
          </div>
        )}
        <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
          {variant === WriteCardVariant.main && <Heading headingLevel={HeadingSize.h4}>Hey, was läuft?</Heading>}

          {variant === WriteCardVariant.inline && (
            <UserShortRepresentation
              alt={session.user.username}
              displayName={`${session.user.firstname} ${session?.user.lastname}`}
              hrefProfile={`../profile/${session.user.id}`}
              imageComponent={Image}
              imageComponentArgs={{ width: 50, height: 50 }}
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
            {form.file && (
              <div className="rounded-lg mx-auto my-0 overflow-hidden">
                <Image src={URL.createObjectURL(form.file)} alt={form.file.name} width="200" height="200"></Image>
              </div>
            )}
            <Textarea
              ariaLabel="Und was meinst du dazu?"
              disabled={isSubmitting}
              errorMessage={form.textinputError}
              name="textinput"
              onChange={handleChange}
              placeholder="Und was meinst du dazu?"
              required
              rows={5}
              value={form.textinput}
            />
            {/* todo: stack direction auf col bei breakpoint sm*/}
            <Stack direction={StackDirection.row} spacing={StackSpacing.s}>
              <TextButton
                color={TextButtonColor.slate}
                displayMode={TextButtonDisplayMode.fullWidth}
                icon={<IconUpload />}
                onClick={fileUploadClick}
                size={TextButtonSize.m}
                type="button"
              >
                Bild hochladen
              </TextButton>
              <TextButton
                color={TextButtonColor.violet}
                disabled={isSubmitting}
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
          handleFileChange={handleFileChange}
          isOpen={isOpenFileUpload}
          setIsOpen={setIsOpenFileUpload}
          file={form.file}
          fileInputError={fileinputError}
        />
      </Card>
    )
  );
};
