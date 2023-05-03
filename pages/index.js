import Layout from '@/components/Layout';
import Grid from '@/components/Grid';

// the data comes through a JSON file from within our project, ./data.json
// import homes from 'data.json';

// Import the generated Prisma client
import { PrismaClient } from '@prisma/client'

// Instantiate it
const prisma = new PrismaClient()

export async function getServerSideProps() {
  // Get all homes
  // https://www.prisma.io/docs/concepts/components/prisma-client/crud
  const homes = await prisma.home.findMany();
  
  // Pass the data to the Home page
  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    }
  };
}

// This data is then passed down from the Home component to the Grid component as a prop.
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