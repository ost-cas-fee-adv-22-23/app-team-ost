import { WriteCard, WriteCardVariant } from '@/components/cards/write-card';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// todo: Sollen jest mocks verwendet werden?
const mockFormEmpty = {
  textinputError: '',
  textinput: '',
  file: null,
};

const mockFormWithImage = {
  textinputError: '',
  textinput: '',
  file: new File(['test file content'], 'test.jpg', {
    type: 'image/jpeg',
  }),
};

const mockJwtPayload = {
  accessToken: '###TOKEN###',
  user: {
    id: '201164897906589953',
    firstname: 'max.muster',
    lastname: 'Muster',
    username: 'mmuster',
    avatarUrl:
      'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/201164897906589953/avatar?v=11c624e37fed31130f05b04b679232e2',
  },
};

// todo: Wie sollen die describe Blöcke verschachtelt werden?
describe('WriteCard', () => {
  describe('render variants', () => {
    it('should render WriteCard as newMumble variant', () => {
      // ARRANGE
      const handleTextChange = jest.fn();
      const handleFileChange = jest.fn();
      const handleSubmit = jest.fn();
      const resetFileinputError = jest.fn();
      render(
        <WriteCard
          variant={WriteCardVariant.newMumble}
          jwtPayload={mockJwtPayload}
          handleChange={handleTextChange}
          handleSubmit={handleSubmit}
          handleFileChange={handleFileChange}
          isSubmitting={false}
          resetFileinputError={resetFileinputError}
          fileinputError={''}
          form={mockFormEmpty}
        />
      );

      // ASSERT
      expect(screen.getByText('Hey, was läuft?')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Und was meinst du dazu?')).toBeInTheDocument();
      expect(screen.getByText('Bild hochladen')).toBeInTheDocument();
      expect(screen.getByText('Absenden')).toBeInTheDocument();
      expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
      expect(screen.queryByTestId('user-short-representation')).not.toBeInTheDocument();
    });

    it('should render WriteCard as replyMumble variant', () => {
      // ARRANGE
      const handleTextChange = jest.fn();
      const handleFileChange = jest.fn();
      const handleSubmit = jest.fn();
      const resetFileinputError = jest.fn();

      render(
        <WriteCard
          variant={WriteCardVariant.replyMumble}
          jwtPayload={mockJwtPayload}
          handleChange={handleTextChange}
          handleSubmit={handleSubmit}
          handleFileChange={handleFileChange}
          isSubmitting={false}
          resetFileinputError={resetFileinputError}
          fileinputError={''}
          form={mockFormEmpty}
        />
      );

      // ASSERT
      expect(screen.queryByText('Hey, was läuft?')).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText('Und was meinst du dazu?')).toBeInTheDocument();
      expect(screen.getByText('Bild hochladen')).toBeInTheDocument();
      expect(screen.getByText('Absenden')).toBeInTheDocument();
      expect(screen.queryByTestId('profile-picture')).not.toBeInTheDocument();
      expect(screen.getByTestId('user-short-representation')).toBeInTheDocument();
    });
  });

  it('should open modal on button `Bild hochladen` click', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const handleTextChange = jest.fn();
    const handleFileChange = jest.fn();
    const handleSubmit = jest.fn();
    const resetFileinputError = jest.fn();
    render(
      <WriteCard
        variant={WriteCardVariant.replyMumble}
        jwtPayload={mockJwtPayload}
        handleChange={handleTextChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        isSubmitting={false}
        resetFileinputError={resetFileinputError}
        fileinputError={''}
        form={mockFormEmpty}
      />
    );

    // ACT
    await user.click(screen.getByText('Bild hochladen'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should call handleFileChange and resetFileinputError after uploading new image', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const handleTextChange = jest.fn();
    const handleFileChange = jest.fn();
    const handleSubmit = jest.fn();
    const resetFileinputError = jest.fn();
    const file = new File(['test file content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    render(
      <WriteCard
        variant={WriteCardVariant.replyMumble}
        jwtPayload={mockJwtPayload}
        handleChange={handleTextChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        isSubmitting={false}
        resetFileinputError={resetFileinputError}
        fileinputError={''}
        form={mockFormEmpty}
      />
    );

    // ACT
    await user.click(screen.getByText('Bild hochladen'));
    const hiddenInputElement = screen.getByTestId('fileinput').firstElementChild?.firstElementChild as HTMLElement;
    await user.upload(hiddenInputElement, file);
    await user.click(screen.getByText('Speichern'));

    expect(handleFileChange).toHaveBeenCalledTimes(1);
    expect(resetFileinputError).toHaveBeenCalledTimes(1);
  });

  it('should call TextChange after writing text', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const handleTextChange = jest.fn();
    const handleFileChange = jest.fn();
    const handleSubmit = jest.fn();
    const resetFileinputError = jest.fn();
    render(
      <WriteCard
        variant={WriteCardVariant.replyMumble}
        jwtPayload={mockJwtPayload}
        handleChange={handleTextChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        isSubmitting={false}
        resetFileinputError={resetFileinputError}
        fileinputError={''}
        form={mockFormEmpty}
      />
    );

    // ACT
    await user.type(screen.getByPlaceholderText('Und was meinst du dazu?'), 'TEST');

    // ASSERT
    expect(handleTextChange).toHaveBeenCalled();
  });

  it('should preview image if already one is uploaded', () => {
    // ARRANGE
    const handleTextChange = jest.fn();
    const handleFileChange = jest.fn();
    const handleSubmit = jest.fn();
    const resetFileinputError = jest.fn();

    render(
      <WriteCard
        variant={WriteCardVariant.replyMumble}
        jwtPayload={mockJwtPayload}
        handleChange={handleTextChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        isSubmitting={false}
        resetFileinputError={resetFileinputError}
        fileinputError={''}
        form={mockFormWithImage}
      />
    );

    expect(screen.getByAltText(mockFormWithImage.file.name)).toBeInTheDocument();
  });

  it('should disable button `Absenden` while submitting form', () => {
    // ARRANGE
    const handleTextChange = jest.fn();
    const handleFileChange = jest.fn();
    const handleSubmit = jest.fn();
    const resetFileinputError = jest.fn();

    render(
      <WriteCard
        variant={WriteCardVariant.replyMumble}
        jwtPayload={mockJwtPayload}
        handleChange={handleTextChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        isSubmitting={true}
        resetFileinputError={resetFileinputError}
        fileinputError={''}
        form={mockFormWithImage}
      />
    );

    // ASSERT
    expect(screen.getByTestId('button-submit')).toHaveAttribute('disabled');
  });

  it('should enable button `Absenden` while not submitting form', () => {
    // ARRANGE
    const handleTextChange = jest.fn();
    const handleFileChange = jest.fn();
    const handleSubmit = jest.fn();
    const resetFileinputError = jest.fn();

    render(
      <WriteCard
        variant={WriteCardVariant.replyMumble}
        jwtPayload={mockJwtPayload}
        handleChange={handleTextChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        isSubmitting={false}
        resetFileinputError={resetFileinputError}
        fileinputError={''}
        form={mockFormWithImage}
      />
    );

    // ASSERT
    expect(screen.getByTestId('button-submit')).not.toHaveAttribute('disabled');
  });
});
