import {
  Form,
  IconCancel,
  IconCheckmark,
  Input,
  InputTypes,
  Label,
  LabelSize,
  Modal,
  ModalType,
  Stack,
  StackDirection,
  StackSpacing,
  Textarea,
  TextButton,
  TextButtonColor,
  TextButtonDisplayMode,
  TextButtonSize,
} from '@smartive-education/design-system-component-library-team-ost';
import { ChangeEvent, FC, FormEvent } from 'react';

type SettingsModalProps = {
  form: {
    name: string;
    email: string;
    city: string;
    biography: string;
  };
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isOpen: boolean;
  setIsOpen: (e: boolean) => void;
};

export const SettingsModal: FC<SettingsModalProps> = ({ form, handleChange, handleSubmit, isOpen, setIsOpen }) => {
  return (
    <Modal isOpen={isOpen} modalType={ModalType.narrow} onClose={() => setIsOpen(false)} title="Einstellungen">
      <Form
        handleSubmit={(e) => {
          handleSubmit(e);
        }}
        stackDir={StackDirection.col}
        stackSpacing={StackSpacing.s}
      >
        <Label size={LabelSize.xl}>Persönliche Einstellungen</Label>
        <Input
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
            onClick={() => setIsOpen(false)}
            size={TextButtonSize.m}
          >
            Abbrechen
          </TextButton>
          <TextButton
            color={TextButtonColor.violet}
            displayMode={TextButtonDisplayMode.fullWidth}
            icon={<IconCheckmark />}
            onClick={() => {
              console.log('');
            }}
            size={TextButtonSize.m}
            type="submit"
          >
            Speichern
          </TextButton>
        </Stack>
      </Form>
    </Modal>
  );
};
export default SettingsModal;
