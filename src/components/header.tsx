import {
  PageHeader,
  MumbleWhiteHorizontal,
  Navigation,
  ProfilePictureButton,
  SettingsButton,
  LogoutButton,
} from '@smartive-education/design-system-component-library-team-ost';
import { SettingsModal } from './modals/settings-modal';
import { ChangeEvent, FC, FormEvent, ReactElement, useState } from 'react';
import { FileuploadModal } from './modals/fileupload-modal';

type HeaderProps = {
  children?: ReactElement;
};

export const Header: FC<HeaderProps> = () => {
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

  return (
    <PageHeader>
      <div className="flex items-center justify-between w-full sm:w-7/12">
        <div className="h-10">
          <MumbleWhiteHorizontal
            ariaLabel="Go to mumble"
            onClick={() => {
              console.log('click');
            }}
          />
        </div>
        <Navigation>
          <ProfilePictureButton
            alt="Robert Vogt"
            aria-label="Edit profilepicture"
            onClick={() => setIsOpenFileUpload(true)}
            src="https://media.licdn.com/dms/image/D4E03AQEXHsHgH4BwJg/profile-displayphoto-shrink_800_800/0/1666815812197?e=2147483647&v=beta&t=Vx6xecdYFjUt3UTCmKdh2U-iHvY0bS-fcxlp_LKbxYw"
          />
          <SettingsButton onClick={() => setIsOpenSettings(true)} />
          <LogoutButton
            onClick={() => {
              console.log('click');
            }}
          />
        </Navigation>
      </div>
      {/* MODAL for Settings */}
      <SettingsModal
        form={form}
        handleChange={handleChange}
        isOpen={isOpenSettings}
        setIsOpen={setIsOpenSettings}
        handleSubmit={handleSubmitSettings}
      />

      {/* MODAL for Image Upload */}
      <FileuploadModal
        handleChange={handleFileChange}
        isOpen={isOpenFileUpload}
        setIsOpen={setIsOpenFileUpload}
        handleSubmit={handleSubmitFileupload}
      />
    </PageHeader>
  );
};
