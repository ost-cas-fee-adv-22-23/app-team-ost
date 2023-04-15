import { SettingsModal } from '@/components/modals/settings-modal';
import {
  Label,
  LabelSize,
  LogoutButton,
  MumbleWhiteHorizontal,
  Navigation,
  PageHeader,
  ProfilePictureButton,
  SettingsButton,
} from '@smartive-education/design-system-component-library-team-ost';
import { JWT } from 'next-auth/jwt';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, FormEvent, ReactElement, useState } from 'react';

type HeaderProps = {
  children?: ReactElement;
  jwtPayload?: JWT | null;
};

export const Header: FC<HeaderProps> = (props) => {
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

  const handleSubmitSettings = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //TODO call api function
    console.log(form);
    console.log('submit settings');
    setIsOpenSettings(false);
  };

  const navigation = props.jwtPayload ? (
    <Navigation>
      {/* We decided to navigate on the profile picture to the profile page */}
      <ProfilePictureButton
        alt={props.jwtPayload.user.username}
        aria-label="go to profile page"
        imageComponent={Image}
        imageComponentArgs={{ width: 50, height: 50 }}
        linkComponent={Link}
        linkComponentArgs={{ href: `/profile/${props.jwtPayload.user.id}` }}
        renderAsLink={true}
        src={props.jwtPayload.user.avatarUrl as string}
      />
      <SettingsButton onClick={() => setIsOpenSettings(true)} />
      <LogoutButton
        linkComponent={Link}
        linkComponentArgs={{ href: `/auth/logout?callbackUrl=${router.asPath}` }}
        renderAsLink={true}
      />
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
      <div className="flex items-center justify-between h-14 w-full sm:w-2/3 2xl:w-1/2">
        <div className="h-10">
          <MumbleWhiteHorizontal ariaLabel="go to timeline" linkComponent={Link} href={'/'} renderWithLink={true} />
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
