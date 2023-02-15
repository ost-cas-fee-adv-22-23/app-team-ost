import {
  PageHeader,
  MumbleWhiteHorizontal,
  Navigation,
  ProfilePictureButton,
  SettingsButton,
  LogoutButton,
  Modal,
  ModalType,
  Form,
  StackDirection,
  StackSpacing,
  Label,
  LabelSize,
  Input,
  InputTypes,
  Textarea,
  Stack,
  TextButton,
  TextButtonColor,
  TextButtonDisplayMode,
  IconCancel,
  TextButtonSize,
  IconCheckmark,
  Fileinput,
} from "@smartive-education/design-system-component-library-team-ost";
import { ChangeEvent, FC, ReactElement, useState } from "react";

type HeaderProps = {
  children?: ReactElement;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Header: FC<HeaderProps> = ({ children }: HeaderProps) => {
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [isOpenFileUpload, setIsOpenFileUpload] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    biography: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <PageHeader>
      <div className="flex items-center justify-between w-full sm:w-7/12">
        <div className="h-10">
          <MumbleWhiteHorizontal
            ariaLabel="Go to mumble"
            onClick={() => {
              console.log("click");
            }}
          />
        </div>
        <Navigation>
          <ProfilePictureButton
            alt="Robert Vogt"
            aria-label="Edit profilepicture"
            onClick={() => setIsOpenFileUpload(true)}
            src="https://media.licdn.com/dms/image/D4E03AQEXHsHgH4BwJg/profile-displayphoto-shrink_800_800/0/1666815812197?e=2147483647&v=beta&t=Vx6xecdYFjUt3UTCmKdh2U-iHvY0bS-fcxlp_LKbxYw"
          />
          <SettingsButton onClick={() => setIsOpenSettings(true)} />
          <LogoutButton
            onClick={() => {
              console.log("click");
            }}
          />
        </Navigation>
      </div>
      {/* MODAL for Settings */}
      <Modal
        isOpen={isOpenSettings}
        modalType={ModalType.narrow}
        onClose={() => setIsOpenSettings(false)}
        title="Einstellungen"
      >
        <Form
          handleSubmit={() => {
            console.log("click");
          }}
          stackDir={StackDirection.col}
          stackSpacing={StackSpacing.s}
        >
          <Label size={LabelSize.xl}>Persönliche Einstellungen</Label>
          <Input
            errorMessage="Error-Message"
            label="Name Vorname"
            labelSize={LabelSize.s}
            name="name"
            onChange={handleChange}
            type={InputTypes.text}
            value={form.name}
          />
          <Input
            label="E-Mail-Adresse"
            labelSize={LabelSize.s}
            name="email"
            onChange={handleChange}
            placeholder="E-Mail"
            type={InputTypes.email}
            value={form.email}
          />
          <Input
            label="Ortschaft"
            labelSize={LabelSize.s}
            name="city"
            onChange={handleChange}
            type={InputTypes.text}
            value={form.city}
          />
          <Textarea
            ariaLabel="biography"
            label="Biografie"
            labelSize={LabelSize.s}
            name="biography"
            onChange={handleChange}
            rows={2}
            value={form.biography}
          />
          <Stack direction={StackDirection.row} spacing={StackSpacing.xs}>
            <TextButton
              color={TextButtonColor.slate}
              displayMode={TextButtonDisplayMode.fullWidth}
              icon={<IconCancel />}
              onClick={() => setIsOpenSettings(false)}
              size={TextButtonSize.m}
            >
              Abbrechen
            </TextButton>
            <TextButton
              color={TextButtonColor.violet}
              displayMode={TextButtonDisplayMode.fullWidth}
              icon={<IconCheckmark />}
              onClick={() => {
                console.log("click");
              }}
              size={TextButtonSize.m}
            >
              Speichern
            </TextButton>
          </Stack>
        </Form>
      </Modal>
      {/* MODAL for Image Upload */}
      <Modal
        isOpen={isOpenFileUpload}
        modalType={ModalType.wide}
        title="Bild hochladen"
        onClose={() => setIsOpenFileUpload(false)}
      >
        <Form
          handleSubmit={() => {
            console.log("click");
          }}
          stackDir={StackDirection.col}
          stackSpacing={StackSpacing.s}
        >
          <Fileinput
            description="JPEG oder PNG, maximal 50 MB"
            onAddFile={(file) => {
              console.log(file);
            }}
            title="Datei hierhin ziehen"
          ></Fileinput>
          <Stack direction={StackDirection.row} spacing={StackSpacing.xs}>
            <TextButton
              color={TextButtonColor.slate}
              displayMode={TextButtonDisplayMode.fullWidth}
              icon={<IconCancel />}
              onClick={() => setIsOpenFileUpload(false)}
              size={TextButtonSize.m}
            >
              Abbrechen
            </TextButton>
            <TextButton
              color={TextButtonColor.violet}
              displayMode={TextButtonDisplayMode.fullWidth}
              icon={<IconCheckmark />}
              onClick={() => setIsOpenFileUpload(false)}
              size={TextButtonSize.m}
            >
              Speichern
            </TextButton>
          </Stack>
        </Form>
      </Modal>
    </PageHeader>
  );
};
