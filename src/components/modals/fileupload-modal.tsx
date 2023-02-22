import {
  Fileinput,
  Form,
  IconCancel,
  IconCheckmark,
  Modal,
  ModalType,
  Stack,
  StackDirection,
  StackSpacing,
  TextButton,
  TextButtonColor,
  TextButtonDisplayMode,
  TextButtonSize,
} from '@smartive-education/design-system-component-library-team-ost';
import { FC, FormEvent } from 'react';

type FileuploadProps = {
  handleChange: (file: File) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isOpen: boolean;
  setIsOpen: (e: boolean) => void;
};

export const FileuploadModal: FC<FileuploadProps> = ({ handleChange, handleSubmit, isOpen, setIsOpen }) => {
  return (
    <Modal isOpen={isOpen} modalType={ModalType.wide} title="Bild hochladen" onClose={() => setIsOpen(false)}>
      <Form
        handleSubmit={(e) => {
          handleSubmit(e);
        }}
        stackDir={StackDirection.col}
        stackSpacing={StackSpacing.s}
      >
        <Fileinput
          description="JPEG oder PNG, maximal 50 MB"
          onAddFile={handleChange}
          title="Datei hierhin ziehen"
        ></Fileinput>
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
