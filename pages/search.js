import Link from 'next/link';
import Humanize from 'humanize-plus';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'

import { connectToDB, disconnectDB } from '../lib/database';
import Layout from '../components/layout';

const thumbWidth = 360 * 0.75;
const thumbHeight = 200 * 0.75;
const itemsPerPage = 16;

function buildPageUrl(searchTerm, page) {
  return `/search?q=${searchTerm}&p=${page}`;
}

function truncateStr(str, len) {
  return str.substr(0, 300) + (str.length > len ? '...' : '');
}

function PageLink({ page, searchTerm, p }) {
  return (
    <Link
      href={buildPageUrl(searchTerm, p)}
      passHref
      key={p}>
      <a
        className={`bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === p ? 'bg-gray-100' : ''}`}
      >
        {p+1}
      </a>
    </Link>
  );
}

function PaginationFooter({ searchTerm, totalResults, elapsedTime, totalPages, page }) {
  let endPages = [];
  const startPages = [];
  if (totalPages > 3) {
    for (let i = totalPages - 1; i > totalPages - 4; i--) {
      if (i < 0) {
        break;
      }
      endPages.push(i);
    }
  }

  if (totalPages > 1) {
    if (totalPages <= 3 || page === 0) {
      for (let i = 0; i < Math.min(totalPages + 1, 3); i++) {
        if (i > totalPages) {
          break;
        }
        startPages.push(i);
      }
    } else {
      for (let i = page - 3; i <= page + 3; i++) {
        if (i > totalPages) {
          break;
        }
        if (i >= 0) {
          startPages.push(i);
        }
      }
    }
  }

  endPages = endPages.filter(p => startPages.indexOf(p) === -1).sort();

  return (
    <div className="bg-white px-4 py-8 flex items-center justify-between sm:px-6 w-full">
      <div className="flex-1 flex justify-between sm:hidden">
        <Link
          href={buildPageUrl(searchTerm, page - 1)}
          passHref>
        <a
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </a>
        </Link>
        <Link
          href={buildPageUrl(searchTerm, page - 1)}
          passHref>
          <a
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </a>
        </Link>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{Math.max(page * itemsPerPage, 1)}</span> to <span className="font-medium">{Math.min((page+1) * itemsPerPage, totalResults)}</span> of{' '}
            <span className="font-medium">{Humanize.intword(totalResults, 'nop', 3)}</span> results in {elapsedTime} seconds
            {/*&nbsp;-&nbsp;<span className="font-medium">{Humanize.intword(totalVideos, 'nop', 3)}</span> videos indexed*/}
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {page > 0 && (
              <Link
                href={buildPageUrl(searchTerm, page - 1)}
                passHref>
                <a
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </a>
              </Link>
            )}
            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}

            {startPages.map((p, i) => (
              <PageLink key={i} {...{ page, searchTerm, p }} />
            ))}

            {endPages.length > 0 && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            )}

            {endPages.map((p, i) => (
              <PageLink key={i} {...{ page, searchTerm, p }} />
            ))}

            {page < totalPages - 1 && (
              <Link
                href={buildPageUrl(searchTerm, page + 1)}
                passHref>
                <a
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </a>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}

function getVideoId(url) {
  const ytVideoIDRegex = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  const urlIdMatches = url.match(ytVideoIDRegex);
  if (urlIdMatches && urlIdMatches.length >= 2) {
    const videoId = urlIdMatches[1].substr(0, 11);
    return videoId;
  }
}

function VideoPreview(result) {
  const videoId = getVideoId(result.uri);
  return (
    <div className="w-full lg:max-w-full lg:flex"
      style={{
        minHeight: thumbHeight + 'px',
        minWidth: thumbWidth + 'px'
      }}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={result.uri}
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${videoId}/mqdefault.jpg)`,
          minHeight: thumbHeight + 'px',
          minWidth: thumbWidth + 'px',
          display: 'block',
        }}
        className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden bg-gray-200"
        title={result.title}>
      </a>
      <div className="w-full border-r border-b border-l border-gray-300 lg:border-l-0 lg:border-t lg:border-gray-300 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <div className="text-gray-900 font-bold text-lg mb-2">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={result.uri}>
              {result.title}
            </a>
          </div>
          <p className="text-gray-700 text-base text-xs">
            {truncateStr(result.description || ' ', 128)}
          </p>
        </div>
        <div className="flex items-center">
          <div className="text-sm">
            <p className="text-gray-900 leading-none">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={result.authorUrl}>
                {result.authorName}
              </a>
            </p>
            {/*<p className="text-gray-600">Aug 18</p>*/}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchResults({ searchTerm, results, totalResults, elapsedTime, totalPages, page, error }) {
  return (
    <Layout searchTerm={searchTerm}>
      <main className="flex flex-col items-center justify-center w-full flex-1 md:px-20">
        {results.length > 0 ? (
          <>
            <div className="p-5 md:p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-5 w-full">
              {results.map((result, index) => (
                <VideoPreview key={index} {...result} />
              ))}
            </div>

            <PaginationFooter {...{ searchTerm, totalResults, elapsedTime, totalPages, page }} />
          </>
        ) : (
          error ? (
            <>
              Something went wrong:
              <br />
              <pre>
              {error}
              </pre>
            </>
          ) : (
            <>
              No results yet, but we are indexing your query<br />
              Try again soon or try different search terms
            </>
          )
        )}
      </main>
    </Layout>
  );
}

export async function getServerSideProps({ query, res }) {
  // Ensure these results are cached for atleast 10 seconds
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  let searchTerm = ((query.q || query.query) || '').trim();
  let page = parseInt(query.p || 0, 10);
  if (Number.isNaN(page)) {
    page = 0;
  }

  try {
    // Select database and videos collection
    const timeStart = process.hrtime();
    const db = await connectToDB();
    const videosCollection = db.collection('videos');
    const queriesCollection = db.collection('queries');
    const matchByFullyCrawled = false; // TODO: config filters

    let results = [];
    let totalResults = 0;
    if (!searchTerm || searchTerm === 'random') {
      const aggregation = [];
      if (matchByFullyCrawled) { // Match lengthSeconds existing, meaning fully crawled
        aggregation.push({
          $match: {
            lengthSeconds: {
              $exists: true,
            }
          }
        });
      } else { // Ensure its not just a video URI, needs a title too
        aggregation.push({
          $match: {
            title: {
              $exists: true,
            }
          }
        });
      }

      // Random sample
      aggregation.push({ $sample: { size: itemsPerPage } });
      results = await videosCollection.aggregate(aggregation).toArray();
      totalResults = results.length;
    } else {
      // // Force search term to be AND if no advanced search params supplied
      // if (searchTerm.indexOf(`"`) === -1 && searchTerm.indexOf(`:`) === -1) {
      //   searchTerm = `"${searchTerm}"`;
      // }

      queriesCollection.updateOne({ query: searchTerm }, {
        $set: {
          query: searchTerm, // TODO: do transform to get ngrams etc?
          date: new Date(),
        },
      }, { upsert: true });

      const findTerm = { $text: { $search: searchTerm } };
      const aggregation = await videosCollection.aggregate([
        {
          $match: findTerm
        },
        {
          $addFields: {
            textScore: {"$meta": "textScore"}
          }
        },
        {
          $facet: {
            totalData: [
              { $skip: itemsPerPage * page },
              { $limit: itemsPerPage }
            ],
            totalCount: [
              { $count: "count" }
            ]
          }
        },
        {
          "$sort": { score: { $meta: "textScore" } },
        },
      ]).toArray();

      if (aggregation[0] && aggregation[0].totalCount[0]) {
        results = aggregation[0].totalData;
        totalResults = aggregation[0].totalCount[0].count;
      }
    }

    // Calculate pages for this search
    const totalPages = Math.ceil(totalResults / itemsPerPage);
    const elapsedTime = process.hrtime(timeStart)[1] / 1000000000; // divide by a million to get nano to milli
    if (page > totalPages - 1) {
      page = totalPages - 1;
    }

    // Disconnect from DB manually, for production purposes
    // so we dont spam the DB with open connections on Vercel
    disconnectDB();

    // Map search results into only the data we need with null defaults
    return {
      props: {
        results: results.map(({ uri, authorName = null, authorUrl = null, description = null, title = null }) => {
          return {
            uri,
            authorName,
            authorUrl,
            description,
            title,
          };
        }),
        searchTerm,
        totalResults,
        elapsedTime,
        page,
        totalPages,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        results: [],
        searchTerm,
        totalResults: 0,
        elapsedTime: 0,
        page: 0,
        totalPages: 0,
        error: e.toString(),
      },
    };
  }
}
