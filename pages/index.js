import Layout from '@/components/Layout';
import Grid from '@/components/Grid';

/// 4.1 Fetch data from Supabase using Prisma
/// 4.1 Import the generated Prisma client
import { PrismaClient } from '@prisma/client'

/// 4.1 Instantiate it
const prisma = new PrismaClient()

/// 4.1 Query data in Next.js with Server-Side Rendering (SSR)
/// 4.1 the data comes through a JSON file from within our project, ./data.json
/// 4.1 import homes from 'data.json';
export async function getServerSideProps() {
  /// 4.1 Get all homes
  /// 4.1 https://www.prisma.io/docs/concepts/components/prisma-client/crud
  const homes = await prisma.home.findMany();
  
  /// 4.1 Pass the data to the Home page
  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    }
  };
}

/// 4.1 This data is then passed down from the Home component to the Grid component as a prop.
export default function Home({ homes = [] }) {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">
        Top-rated places to stay
      </h1>
      <p className="text-gray-500">
        Explore some of the best places in the world
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
}