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

  return (
    <Card borderRadiusType={settings.borderRadiusType} isInteractive={settings.isInteractive}>
      {variant === WriteCardVariant.main && (
        <div className="absolute -left-l top-m">
          <ProfilePicture
            alt="Robert Vogt"
            size={ProfilePictureSize.m}
            src="https://media.licdn.com/dms/image/D4E03AQEXHsHgH4BwJg/profile-displayphoto-shrink_800_800/0/1666815812197?e=2147483647&v=beta&t=Vx6xecdYFjUt3UTCmKdh2U-iHvY0bS-fcxlp_LKbxYw"
          />
        </div>
      )}
      <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
        {variant === WriteCardVariant.main && <Heading headingLevel={HeadingSize.h4}>Hey, was läuft?</Heading>}

        {variant === WriteCardVariant.inline && (
          <UserShortRepresentation
            alt="Robert Vogt"
            displayName="Robert Vogt"
            hrefProfile="#"
            labelType={UserShortRepresentationLabelType.m}
            username="robertvogt"
            profilePictureSize={UserShortRepresentationProfilePictureSize.s}
            src="https://media.licdn.com/dms/image/D4E03AQEXHsHgH4BwJg/profile-displayphoto-shrink_800_800/0/1666815812197?e=2147483647&v=beta&t=Vx6xecdYFjUt3UTCmKdh2U-iHvY0bS-fcxlp_LKbxYw"
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
  );
};
