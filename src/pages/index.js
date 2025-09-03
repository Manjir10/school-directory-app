import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the showSchools page
    router.replace('/showSchools');
  }, [router]);

  return (
    <>
      <Head>
        <title>School Directory</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to the directory...</p>
      </div>
    </>
  );
}