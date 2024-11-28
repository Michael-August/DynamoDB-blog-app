// app/404.js
import Head from 'next/head';

function Custom404() {
  return (
    <div>
      <Head>
        <title>Page Not Found</title>
      </Head>
      <h1>404: Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default Custom404;