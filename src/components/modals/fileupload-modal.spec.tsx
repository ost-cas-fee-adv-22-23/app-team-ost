import { FileuploadModal } from '@/components/modals/fileupload-modal';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/*
 * Die FileInputComponent ist Bestandteil der Lib und wird daher in der App nicht getestet. Mögliche Testfälle für die
 * FileinputComponent:
 * - should render Fileinput
 * - should select a valid jpeg file
 * - should select a valid png file
 * - should show an error message if an invalid text file has been selected
 * - should show an error message if a file larger than 5MB has been selected
 * ...
 *
 * Mit diesen Tests wird einzig die Komposition getestet.
 */
describe('FileuploadModal', () => {
  // todo: Was ist mit display fileInputError und isOpen = false? Sollen diese Mappings ebenfalls geprüft werden? Im render Testfall oder in einem eigenen Fall?
  it('should render FileuploadModal', async () => {
    // ARRANGE
    const handleFileChange = jest.fn();
    const setIsOpen = jest.fn();

    render(
      <FileuploadModal
        handleFileChange={handleFileChange}
        isOpen={true}
        setIsOpen={setIsOpen}
        file={null}
        fileInputError={''}
      />
    );

    // ASSERT
    expect(screen.getByText('Bild hochladen')).toBeInTheDocument();
    expect(screen.getByTestId('fileinput')).toBeInTheDocument();
    expect(screen.getByTestId('button-cancel')).toBeInTheDocument();
    expect(screen.getByTestId('button-save')).toBeInTheDocument();
  });

  /*
   * Es wird nur das Schliessen des Dialogs durch den Abbrechen Button im Body des Dialogs in der App getestet. Das
   * Schliessen des Dialogs mittels IconButton im Header ist Bestandteil der ModalComponent in der Lib.
   */
  it('should close FileuploadModal on button cancel click', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const handleFileChange = jest.fn();
    const setIsOpen = jest.fn();

    render(
      <FileuploadModal
        handleFileChange={handleFileChange}
        isOpen={true}
        setIsOpen={setIsOpen}
        file={null}
        fileInputError={''}
      />
    );

    // ACT
    await user.click(screen.getByTestId('button-cancel'));

    // ASSERT
    expect(setIsOpen).toBeCalledWith(false);
  });

  it('should display hint to replace image if already one has been selected', () => {
    // ARRANGE
    const handleFileChange = jest.fn();
    const setIsOpen = jest.fn();
    const file = new File(['test file content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    render(
      <FileuploadModal
        handleFileChange={handleFileChange}
        isOpen={true}
        setIsOpen={setIsOpen}
        file={file}
        fileInputError={''}
      />
    );

    // ASSERT
    expect(screen.getByText(`Willst du das Bild ${file.name} ersetzen?`)).toBeInTheDocument();
  });

  it('should disable save button if no image has been selected', () => {
    // ARRANGE
    const handleFileChange = jest.fn();
    const setIsOpen = jest.fn();

    render(
      <FileuploadModal
        handleFileChange={handleFileChange}
        isOpen={true}
        setIsOpen={setIsOpen}
        file={null}
        fileInputError={''}
      />
    );

    // ASSERT
    expect(screen.getByTestId('button-save')).toHaveAttribute('disabled');
  });

  // todo: Dieser Test prüft auch gleich die Upload Funktionalität. Soll dieser Test beides Prüfen oder soll der Test für den save Button ausgelagert werden?
  it('should enable save button if an image has been selected', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const handleFileChange = jest.fn();
    const setIsOpen = jest.fn();
    const file = new File(['test file content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    render(
      <FileuploadModal
        handleFileChange={handleFileChange}
        isOpen={true}
        setIsOpen={setIsOpen}
        file={null}
        fileInputError={''}
      />
    );

    // ACT
    const hiddenInputElement = screen.getByTestId('fileinput').firstElementChild?.firstElementChild as HTMLElement;
    await user.upload(hiddenInputElement, file);

    // ASSERT
    expect(screen.getByTestId('button-save')).not.toHaveAttribute('disabled');
    expect(screen.getByText('Datei geladen')).toBeInTheDocument();
    expect(screen.getByText(`${file.name} wurde hinzugefügt.`)).toBeInTheDocument();
  });
});
