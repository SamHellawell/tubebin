import Head from 'next/head';
import Layout from '../components/layout';
import TermsText from '../components/tos-text';

export default function Terms() {
  return (
    <Layout>
      <Head>
        <title>tubebin - Terms of Service</title>
      </Head>
      <main className="flex flex-col items-center justify-center w-full md:w-1/2 flex-1 px-10 text-center sm:rounded-lg">
        <TermsText />
      </main>
    </Layout>
  )
}
