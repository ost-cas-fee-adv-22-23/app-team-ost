import {
  Fileinput,
  IconCancel,
  IconCheckmark,
  Label,
  LabelSize,
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
import { FC, useState } from 'react';

type FileuploadProps = {
  handleFileChange: (file: File) => boolean;
  isOpen: boolean;
  setIsOpen: (e: boolean) => void;
  file: File | null;
  fileInputError: string;
};

export const FileuploadModal: FC<FileuploadProps> = ({ handleFileChange, isOpen, file, fileInputError, setIsOpen }) => {
  const [tempfile, setTempfile] = useState<File | null>();

  const handleSaveFile = (): void => {
    if (tempfile) {
      const valid = handleFileChange(tempfile);
      setTempfile(null);

      if (valid) {
        setIsOpen(false);
      }
    }
  };

  const handleCancel = (): void => {
    setIsOpen(false);
    setTempfile(null);
  };

  return (
    <Modal isOpen={isOpen} modalType={ModalType.wide} title="Bild hochladen" onClose={() => setIsOpen(false)}>
      <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
        {file && !tempfile && <Label size={LabelSize.l}>Willst du das Bild {file.name} ersetzen?</Label>}
        <Fileinput
          data-testid="fileinput"
          description="JPEG oder PNG, maximal 5 MB"
          onAddFile={(f) => setTempfile(f)}
          title="Datei hierhin ziehen"
          errorMessage={fileInputError}
        ></Fileinput>
        <Stack direction={StackDirection.row} spacing={StackSpacing.xs}>
          <TextButton
            data-testid="button-cancel"
            color={TextButtonColor.slate}
            displayMode={TextButtonDisplayMode.fullWidth}
            icon={<IconCancel />}
            onClick={handleCancel}
            size={TextButtonSize.m}
          >
            Abbrechen
          </TextButton>

          {/* todo: add a disabled-state style for the button */}
          <TextButton
            data-testid="button-save"
            color={TextButtonColor.violet}
            displayMode={TextButtonDisplayMode.fullWidth}
            icon={<IconCheckmark />}
            onClick={handleSaveFile}
            size={TextButtonSize.m}
            disabled={!tempfile}
          >
            Speichern
          </TextButton>
        </Stack>
      </Stack>
    </Modal>
  );
};
