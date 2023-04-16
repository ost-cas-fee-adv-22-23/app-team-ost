import {
  Paragraph,
  ParagraphSize,
  Stack,
  StackDirection,
  StackSpacing,
  TextLink,
} from '@smartive-education/design-system-component-library-team-ost';
import Link from 'next/link';
import React, { Component, ErrorInfo, ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type State = {
  error?: unknown;
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: unknown) {
    // Update state so the next render will show the fallback UI

    return { hasError: true, error };
  }
  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="w-full lg:w-4/5 2xl:w-1/2 p-xl">
          <Stack spacing={StackSpacing.s} direction={StackDirection.col}>
            <Paragraph size={ParagraphSize.l}>
              Oops, something went wrong. Try to refresh this page or feel free to contact us if the problem persists.
            </Paragraph>
            <TextLink href={'/'} linkComponent={Link} onClick={() => this.setState({ hasError: false })}>
              go to timeline
            </TextLink>
          </Stack>
        </div>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
