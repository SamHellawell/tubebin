import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

import Layout from '../components/layout';
import SearchHeader from '../components/search-header';
import AutocompleteSearch from '../components/autocomplete-search';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!searchQuery) {
      return;
    }

    setIsLoading(true);
    await router.push({ pathname: '/search', query: { q: searchQuery } });
    setIsLoading(false);
  }

  async function handleClickRandom(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    await router.push('/search');
    setIsLoading(false);
  }

  return (
    <Layout withHeader={false}>
      {isLoading ? (
        <>
          <SearchHeader {...{ searchTerm: searchQuery, setIsLoading }} />
          <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
            Loading
          </main>
        </>
      ) : (
        <main className="flex flex-col items-center justify-center w-full flex-1 px-10 text-center">
          <h1 className="text-7xl font-bold">
            <span className="text-blue-600">tube</span>
            bin
          </h1>

          <p className="mt-3 text-2xl">
            Free, anonymous and simple video search service
          </p>

          <AutocompleteSearch
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12"
            onChange={setSearchQuery}
            setIsLoading={setIsLoading}
            formClassName="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full"
            wrapperClassName="w-full"
            maxSuggestions={4}
            formButtons={(
              <div className="flex items-center justify-between mt-8">
                <button
                  type="submit"
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mr-4"
                  onClick={onFormSubmit}
                >
                  Search
                </button>

                <Link href="/search" passHref>
                  <a
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    onClick={handleClickRandom}>
                    Random
                  </a>
                </Link>
              </div>
            )} />
        </main>
      )}
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      buildDate: new Date().toISOString(),
    },
    revalidate: 60 * 60 * 24,
  };
}
