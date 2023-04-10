import Document, { Head, Html, Main, NextScript } from 'next/document';
class MyDocument extends Document {
  render() {
    return (
      <Html lang={'en'}>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/icon-192x192.png" />
          <link rel="shortcut icon" href="/icon-256x256.png" />
          <link rel="shortcut icon" href="/icon-384x384.png" />
          <link rel="shortcut icon" href="/icon-512x512.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
