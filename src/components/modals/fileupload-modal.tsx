import {
  Fileinput,
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
  fileInputError: string;
};

export const FileuploadModal: FC<FileuploadProps> = ({ handleChange, isOpen, file, fileInputError, setIsOpen }) => {
  return (
    <Modal isOpen={isOpen} modalType={ModalType.wide} title="Bild hochladen" onClose={() => setIsOpen(false)}>
      <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
        <Fileinput
          description="JPEG oder PNG, maximal 5 MB"
          onAddFile={(file) => handleChange(file)}
          title="Datei hierhin ziehen"
          errorMessage={fileInputError}
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
            disabled={!file || fileInputError != '' ? true : false}
          >
            Speichern
          </TextButton>
        </Stack>
      </Stack>
    </Modal>
  );
};
