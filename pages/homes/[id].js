/// 4.3 To create a dynamic route, we need to add brackets to a page's filename
// pages/homes/[id].js

import Image from 'next/image';
import Layout from '@/components/Layout';

import { PrismaClient } from '@prisma/client';

// Instantiate Prisma Client
const prisma = new PrismaClient();

const ListedHome = (home = null) => {
  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold truncate">
              {home?.title ?? ''}
            </h1>
            <ol className="inline-flex items-center space-x-1 text-gray-500">
              <li>
                <span>{home?.guests ?? 0} guests</span>
                <span aria-hidden="true"> · </span>
              </li>
              <li>
                <span>{home?.beds ?? 0} beds</span>
                <span aria-hidden="true"> · </span>
              </li>
              <li>
                <span>{home?.baths ?? 0} baths</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-6 relative aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg shadow-md overflow-hidden">
          {home?.image ? (
            <Image
              src={home.image}
              alt={home.title}
              layout="fill"
              objectFit="cover"
            />
          ) : null}
        </div>

        <p className="mt-8 text-lg">{home?.description ?? ''}</p>
      </div>
    </Layout>
  );
};

/// 4.3 define the getStaticPaths function
export async function getStaticPaths() {
    // Get all the homes IDs from the database
    /// 4.3 call prisma.home.findMany to get all the home records from our database
    /// 4.3 only retrieve the id field of each record using the select directive from Prisma
    const homes = await prisma.home.findMany({
      select: { id: true },
    });
    
    /// 4.3 Get the paths with all the IDs of the homes for which we'd like to pre-render the page
    const paths = homes.map(home => ({
      params: { id: home.id },
    }));

    /// 4.3 fallback is set to false so that any paths not returned by getStaticPaths will result in a 404 page 
    /// 4.4 fallback is set to true so that any paths not returned by getStaticPaths will result in a page that will be generated on the fly
    return { paths, 
        fallback: true,
    };
}     

export async function getStaticProps({ params }) {
    // Get the current home from the database
    /// 4.3 fetch the data of the requested route using Prisma findUnique function with the id retrieved from the query params object.
    const home = await prisma.home.findUnique({
        where: { id: params.id },
    });

    /// 4.3 if affirmative, return it as a prop to the ListedHome React component.
    if (home) {
        return {
        props: JSON.parse(JSON.stringify(home)),
        };
    }

    /// 4.3 return an object to tell Next.js to redirect the user to the homepage of our app if the requested home can't be found.
    return {
        redirect: {
        destination: '/',
        permanent: false,
        },
    };
}
  
export default ListedHome;

/// 4.3 import Link from 'next/Link' is in 'components/Card.js'