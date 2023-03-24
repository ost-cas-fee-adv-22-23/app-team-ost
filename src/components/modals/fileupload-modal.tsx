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
import { FC } from 'react';

type FileuploadProps = {
  handleChange: (file: File) => void;
  isOpen: boolean;
  setIsOpen: (e: boolean) => void;
  file: File | null;
  fileError: string;
};

export const FileuploadModal: FC<FileuploadProps> = ({ handleChange, isOpen, file, fileError, setIsOpen }) => {
  return (
    <Modal isOpen={isOpen} modalType={ModalType.wide} title="Bild hochladen" onClose={() => setIsOpen(false)}>
        <Fileinput
          description="JPEG oder PNG, maximal 5 MB"
          onAddFile={(file) => handleChange(file)}
          title="Datei hierhin ziehen"
          errorMessage={fileError}
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

          {/* todo: add a disbabled-state style for the button */}
          <TextButton
            color={TextButtonColor.violet}
            displayMode={TextButtonDisplayMode.fullWidth}
            icon={<IconCheckmark />}
            onClick={() => setIsOpen(false)}
            size={TextButtonSize.m}
            disabled={(!file || fileError != '') ? true : false}
          >
            Speichern
          </TextButton>
        </Stack>
    </Modal>
  );
};
