import SplitScreenLayout from '@/components/layouts/split-screen-layout';
import {
  Form,
  Heading,
  HeadingSize,
  IconEye,
  IconMumble,
  Input,
  InputTypes,
  Label,
  LabelSize,
  Stack,
  StackAlignItems,
  StackDirection,
  StackJustifyContent,
  StackSpacing,
  TextButton,
  TextButtonColor,
  TextButtonSize,
  TextLink,
} from '@smartive-education/design-system-component-library-team-ost';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useState } from 'react';

export default function Register() {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    firstName: '',
    userName: '',
    email: '',
    password: '',
  });

  const handleLoginFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // todo: Register mittels Formular implementieren (reducer)
    console.warn('handleRegisterFormSubmit', e);
  };

  return (
    <SplitScreenLayout>
      <>
        <Head>
          <title>Mumble - Registrieren</title>
        </Head>

        {!session && (
          <div className="w-full lg:w-4/5 2xl:w-1/2 p-xl">
            <Stack direction={StackDirection.col} spacing={StackSpacing.xl}>
              <Heading headingLevel={HeadingSize.h1}>Registrieren</Heading>
              <Stack direction={StackDirection.col} spacing={StackSpacing.l}>
                <Form handleSubmit={handleRegisterFormSubmit} stackDir={StackDirection.col} stackSpacing={StackSpacing.s}>
                  <Input
                    label="Vorname"
                    labelSize={LabelSize.m}
                    name="firstName"
                    onChange={handleLoginFormChange}
                    placeholder="Vorname"
                    type={InputTypes.text}
                    value={form.firstName}
                  />
                  <Input
                    label="Benutzername"
                    labelSize={LabelSize.m}
                    name="userName"
                    onChange={handleLoginFormChange}
                    placeholder="Benutzername"
                    type={InputTypes.text}
                    value={form.userName}
                  />
                  <Input
                    label="E-Mail"
                    labelSize={LabelSize.m}
                    name="email"
                    onChange={handleLoginFormChange}
                    placeholder="E-Mail"
                    type={InputTypes.email}
                    value={form.email}
                  />
                  <Input
                    icon={<IconEye />}
                    label="Password"
                    labelSize={LabelSize.m}
                    name="password"
                    onChange={handleLoginFormChange}
                    placeholder="Passwort"
                    type={InputTypes.password}
                    value={form.password}
                  />
                  <TextButton
                    onClick={() => {
                      console.warn('onRegisterClick');
                    }}
                    type="submit"
                    ariaLabel={'register'}
                    color={TextButtonColor.gradient}
                    icon={<IconMumble />}
                    size={TextButtonSize.l}
                  >
                    Let&apos;s mumble
                  </TextButton>
                </Form>
              </Stack>

              <Stack
                spacing={StackSpacing.s}
                alignItems={StackAlignItems.center}
                justifyContent={StackJustifyContent.center}
              >
                <Label size={LabelSize.s}>Bereits registriert?</Label>
                <TextLink href={'/auth/login'} linkComponent={Link}>
                  Jetzt anmelden
                </TextLink>
              </Stack>
            </Stack>
          </div>
        )}
      </>
    </SplitScreenLayout>
  );
}
