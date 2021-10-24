import Head from 'next/head';
import Layout from '../components/layout';
import AboutText from '../components/about-text';

export default function About() {
  return (
    <Layout>
      <Head>
        <title>tubebin - About</title>
      </Head>
      <main className="flex flex-col items-center justify-center w-full md:w-1/2 flex-1 px-10 text-center sm:rounded-lg">
        <AboutText />
      </main>
    </Layout>
  )
}
