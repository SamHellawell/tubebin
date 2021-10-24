import { VideoCameraIcon } from '@heroicons/react/outline';
import React from 'react';
import Link from 'next/link';

import AutocompleteSearch from './autocomplete-search';

export default function SearchHeader({ searchTerm, setSearchQuery, setIsLoading }) {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal p-4 w-full bg-gray-100">
      <Link href="/" passHref>
        <a className="flex items-center flex-no-shrink mr-6">
          <VideoCameraIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          <span className="font-semibold text-xl tracking-tight">
            <span className="text-blue-600">tube</span>
            bin
          </span>
        </a>
      </Link>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <AutocompleteSearch
          className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-10"
          defaultValue={searchTerm}
          onChange={setSearchQuery}
          setIsLoading={setIsLoading}
          formClassName="text-sm lg:flex-grow"
          wrapperClassName="flex items-center justify-center w-full"
          />
      </div>
    </nav>
  );
}
