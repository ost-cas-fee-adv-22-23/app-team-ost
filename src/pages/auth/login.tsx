import { signIn, useSession } from 'next-auth/react';
import SplitScreenLayout from '../../components/layouts/split-screen-layout';
import Head from 'next/head';
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
  Paragraph,
  ParagraphSize,
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
import React, { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const callbackUrl = (router.query?.callbackUrl as string) ?? '/';

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleLoginFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // todo: Login mittels Formular implementieren (reducer)
    console.warn('handleLoginFormSubmit', e);
  };

  const handleLoginWithZITADEL = async (): Promise<void> => {
    await signIn('zitadel', { callbackUrl });
  };

  return (
    <SplitScreenLayout>
      <>
        <Head>
          <title>Mumble - Anmelden</title>
        </Head>

        <div className="w-full lg:w-4/5 2xl:w-1/2 p-xl">
          {!!session && (
            <Stack direction={StackDirection.col} spacing={StackSpacing.xl}>
              <Heading headingLevel={HeadingSize.h1}>Anmelden</Heading>
              <Paragraph size={ParagraphSize.m}>
                Sie sind bereits angemeldet. Möchten Sie sich abmelden?{' '}
                <TextLink href={'/auth/logout'} linkComponent={Link}>
                  Jetzt abmelden
                </TextLink>
              </Paragraph>
            </Stack>
          )}

          {!session && (
            <Stack direction={StackDirection.col} spacing={StackSpacing.xl}>
              <Heading headingLevel={HeadingSize.h1}>Anmelden</Heading>
              <Stack direction={StackDirection.col} spacing={StackSpacing.l}>
                <Form handleSubmit={handleLoginFormSubmit} stackDir={StackDirection.col} stackSpacing={StackSpacing.s}>
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
                      console.warn('onLoginWithFormClick');
                    }}
                    type="submit"
                    ariaLabel={'login'}
                    color={TextButtonColor.gradient}
                    icon={<IconMumble />}
                    size={TextButtonSize.l}
                  >
                    Let&apos;s mumble
                  </TextButton>
                </Form>
                <TextButton
                  onClick={handleLoginWithZITADEL}
                  ariaLabel={'login with zitadel'}
                  color={TextButtonColor.gradient}
                  icon={<IconMumble />}
                  size={TextButtonSize.l}
                >
                  Anmelden mit ZITADEL
                </TextButton>
              </Stack>

              <Stack
                spacing={StackSpacing.s}
                alignItems={StackAlignItems.center}
                justifyContent={StackJustifyContent.center}
              >
                <Label size={LabelSize.s}>Nock kein Account?</Label>
                <TextLink href={'/auth/register'} linkComponent={Link}>
                  Jetzt registrieren
                </TextLink>
              </Stack>
            </Stack>
          )}
        </div>
      </>
    </SplitScreenLayout>
  );
}
