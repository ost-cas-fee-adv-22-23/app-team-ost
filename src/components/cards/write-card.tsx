import { FileuploadModal } from '@/components/modals/fileupload-modal';
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
import { JWT } from 'next-auth/jwt';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, FC, FormEvent, useState } from 'react';

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
  jwtPayload: JWT;
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

// todo: eigener Typ
export const WriteCard: FC<WriteCardProps> = ({
  form,
  variant,
  handleChange,
  handleFileChange,
  resetFileinputError,
  fileinputError,
  handleSubmit,
  isSubmitting,
  jwtPayload,
}) => {
  const settings = writeCardVariantMap[variant] || writeCardVariantMap.inline;
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
    jwtPayload && (
      <Card borderRadiusType={settings.borderRadiusType} isInteractive={settings.isInteractive}>
        {variant === WriteCardVariant.main && (
          <div className="absolute -left-l top-m">
            <ProfilePicture
              alt={jwtPayload.user.username}
              imageComponent={Image}
              width={80}
              height={80}
              size={ProfilePictureSize.m}
              src={jwtPayload.user.avatarUrl}
            />
          </div>
        )}
        <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
          {variant === WriteCardVariant.main && <Heading headingLevel={HeadingSize.h4}>Hey, was läuft?</Heading>}

          {variant === WriteCardVariant.inline && (
            <UserShortRepresentation
              alt={jwtPayload.user.username}
              displayName={`${jwtPayload.user.firstname} ${jwtPayload?.user.lastname}`}
              hrefProfile={`../profile/${jwtPayload.user.id}`}
              imageComponent={Image}
              imageComponentArgs={{ width: 50, height: 50 }}
              labelType={UserShortRepresentationLabelType.m}
              linkComponent={Link}
              profilePictureSize={UserShortRepresentationProfilePictureSize.s}
              src={jwtPayload.user.avatarUrl ?? ''}
              username={jwtPayload.user.username}
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
            <Stack
              direction={{
                default: StackDirection.col,
                sm: StackDirection.col,
                md: StackDirection.col,
                lg: StackDirection.row,
              }}
              spacing={StackSpacing.s}
            >
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
