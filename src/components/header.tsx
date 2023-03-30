import {
  PageHeader,
  MumbleWhiteHorizontal,
  Navigation,
  ProfilePictureButton,
  SettingsButton,
  LogoutButton,
  Label,
  LabelSize,
} from '@smartive-education/design-system-component-library-team-ost';
import { SettingsModal } from './modals/settings-modal';
import { ChangeEvent, FC, FormEvent, ReactElement, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

type HeaderProps = {
  children?: ReactElement;
};

export const Header: FC<HeaderProps> = () => {
  const { data: session } = useSession();
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    city: '',
    biography: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileButtonClick = () => {
    router.push(`/profile/${session?.user.id}`);
  };

  const handleLogoutButtonClick = () => {
    router.push(`/auth/logout?callbackUrl=${router.asPath}`);
  };

  const handleSubmitSettings = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //TODO call api function
    console.log(form);
    console.log('submit settings');
    setIsOpenSettings(false);
  };

  const navigation = session ? (
    <Navigation>
      {/* We decided to navigate on the profile picture to the profilepage */}
      <ProfilePictureButton
        alt={session.user.username}
        aria-label="edit profile picture"
        imageComponent={Image}
        imageComponentArgs={{ width: 50, height: 50 }}
        onClick={handleProfileButtonClick}
        src={session.user.avatarUrl as string}
      />
      <SettingsButton onClick={() => setIsOpenSettings(true)} />
      <LogoutButton onClick={handleLogoutButtonClick} />
    </Navigation>
  ) : (
    <Navigation>
      <Link href={`/auth/login?callbackUrl=${router.asPath}`}>
        <div className="text-white">
          <Label size={LabelSize.l}>Login</Label>
        </div>
      </Link>
    </Navigation>
  );

  return (
    <PageHeader>
      <div className="flex items-center justify-between w-full sm:w-7/12">
        <div className="h-10">
          <MumbleWhiteHorizontal ariaLabel="Go to mumble" linkComponent={Link} href={'/'} renderWithLink />
        </div>
        {navigation}
      </div>
      <SettingsModal
        form={form}
        handleChange={handleChange}
        isOpen={isOpenSettings}
        setIsOpen={setIsOpenSettings}
        handleSubmit={handleSubmitSettings}
      />
    </PageHeader>
  );
};
