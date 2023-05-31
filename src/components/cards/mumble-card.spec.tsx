import { MumbleCard, MumbleCardVariant } from '@/components/cards/mumble-card';
import { Mumble } from '@/types/mumble';
import { User } from '@/types/user';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockMumble: Mumble = {
  id: '01GZYECJZ4GXBT4E59YP89WR36',
  likeCount: 7,
  likedByUser: true,
  createdAt: '',
  creator: {} as User,
  replyCount: 42,
  text: 'My Mumble Text.',
  type: 'post',
};

/*
 * Die Funktionalität der Share Action (Copy Link Button) ist Bestandteil der Lib und wird daher in der App nicht
 * getestet. Dasselbe gilt für die Like Action, da diese Optimistic Update verwendet. Im Falle der Like Action soll
 * einzig geprüft werden ob der onLikeClick-Callback erfolgreich ausgeführt wird.
 *
 * Mit diesen Tests wird einzig die Komposition getestet.
 */

// todo: Test mit Bild

describe('MumbleCard', () => {
  it('should render card as list', () => {
    // ARRANGE
    const handleOnLikeClick = jest.fn();
    render(<MumbleCard mumble={mockMumble} onLikeClick={handleOnLikeClick} variant={MumbleCardVariant.list} />);

    // ASSERT
    expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
    expect(screen.getByText('My Mumble Text.')).toBeInTheDocument();
    expect(screen.queryByTestId('user-short-representation-reply')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-short-representation-not-reply')).toBeInTheDocument();
    expect(screen.queryByTestId('action-reply')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-like')).not.toBeInTheDocument();
    expect(screen.getByTestId('action-share')).toBeInTheDocument();
  });

  it('should render card as detail', () => {
    // ARRANGE
    const handleOnLikeClick = jest.fn();
    render(<MumbleCard mumble={mockMumble} onLikeClick={handleOnLikeClick} variant={MumbleCardVariant.detail} />);

    // ASSERT
    expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
    expect(screen.getByText('My Mumble Text.')).toBeInTheDocument();
    expect(screen.queryByTestId('user-short-representation-reply')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-short-representation-not-reply')).toBeInTheDocument();
    expect(screen.queryByTestId('action-reply')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-like')).not.toBeInTheDocument();
    expect(screen.getByTestId('action-share')).toBeInTheDocument();
  });

  it('should render card as reply', () => {
    // ARRANGE
    const handleOnLikeClick = jest.fn();
    render(<MumbleCard mumble={mockMumble} onLikeClick={handleOnLikeClick} variant={MumbleCardVariant.reply} />);

    // ASSERT
    expect(screen.queryByTestId('profile-picture')).not.toBeInTheDocument();
    expect(screen.getByText('My Mumble Text.')).toBeInTheDocument();
    expect(screen.getByTestId('user-short-representation-reply')).toBeInTheDocument();
    expect(screen.queryByTestId('user-short-representation-not-reply')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-reply')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-like')).not.toBeInTheDocument();
    expect(screen.getByTestId('action-share')).toBeInTheDocument();
  });

  it('should display reply action', () => {
    // ARRANGE
    const handleOnLikeClick = jest.fn();
    render(
      <MumbleCard
        mumble={mockMumble}
        onLikeClick={handleOnLikeClick}
        variant={MumbleCardVariant.reply}
        isReplyActionVisible={true}
      />
    );

    // ASSERT
    expect(screen.getByTestId('action-reply')).toBeInTheDocument();
  });

  it('should display like action', () => {
    // ARRANGE
    const handleOnLikeClick = jest.fn();
    render(
      <MumbleCard
        mumble={mockMumble}
        onLikeClick={handleOnLikeClick}
        variant={MumbleCardVariant.reply}
        isLikeActionVisible={true}
      />
    );

    // ASSERT
    expect(screen.getByTestId('action-like')).toBeInTheDocument();
  });

  // todo: keine kompliziert aufeinander aufbauende e2e Test: Sollen display like action und handle zusammengefasst werden?
  it('should handle on like click', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const handleOnLikeClick = jest.fn();
    render(
      <MumbleCard
        mumble={mockMumble}
        onLikeClick={handleOnLikeClick}
        variant={MumbleCardVariant.list}
        isLikeActionVisible={true}
      />
    );

    // ACT
    await user.click(screen.getByTestId('action-like'));

    // ASSERT
    expect(handleOnLikeClick).toHaveBeenCalledTimes(1);
  });
});
