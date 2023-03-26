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
import { FileuploadModal } from './modals/fileupload-modal';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

type HeaderProps = {
  children?: ReactElement;
};

export const Header: FC<HeaderProps> = () => {
  const { data: session } = useSession();
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [isOpenFileUpload, setIsOpenFileUpload] = useState(false);

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

  const [file, setFile] = useState<File>();

  const handleFileChange = (file: File) => {
    console.log(file);
    setFile(file);
  };

  const handleSubmitSettings = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //TODO call api function
    console.log(form);
    console.log('submit settings');
    setIsOpenSettings(false);
  };
  const handleSubmitFileupload = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //TODO call api function
    console.log(file);
    console.log('submit fileupload');
    setIsOpenFileUpload(false);
  };

  const navigation = session ? (
    <Navigation>
      <ProfilePictureButton
        alt={session.user.username}
        aria-label="edit profile picture"
        imageComponent={Image}
        imageComponentArgs={{ width: 50, height: 50 }}
        onClick={() => setIsOpenFileUpload(true)}
        src={session.user.avatarUrl as string}
      />
      <SettingsButton onClick={() => setIsOpenSettings(true)} />
      <LogoutButton onClick={() => signOut()} />
    </Navigation>
  ) : (
    <Navigation>
      <Link href={'/login'}>
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
      <FileuploadModal
        handleChange={handleFileChange}
        isOpen={isOpenFileUpload}
        setIsOpen={setIsOpenFileUpload}
        handleSubmit={handleSubmitFileupload}
      />
    </PageHeader>
  );
};
