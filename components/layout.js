import Head from 'next/head'
import { useState } from 'react';
import TubebinFooter from '../components/footer';
import SearchHeader from '../components/search-header';

export default function Layout({ children, searchTerm = '', withHeader = true }) {
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>tubebin</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {withHeader && (
        <SearchHeader {...{ searchTerm: searchQuery, setSearchQuery, setIsLoading }} />
      )}

      {isLoading ? (
        <main className="flex flex-col items-center justify-center w-full flex-1 px-10 md:px-20">
          Loading
        </main>
      ) : children}

      <TubebinFooter />
    </div>
  );
}
