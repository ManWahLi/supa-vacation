/// 4.2 Since we cannot use Prisma directly on the client-side, 
/// 4.2 let's create an API endpoint within our Next.js project to handle HTTP POST requests to create new records in the database.
/// 4.2 Again, Next.js uses a filesystem-based routing for the API routes. 
/// 4.2 Any file inside the folder pages/api is mapped to /api/* and will be treated as an API endpoint instead of a page. 
/// 4.2 That's very useful as we can have everything inside the same project, the front-end of our web app but also the API endpoints.
/// 4.2 So, create a new file named homes.js inside the pages/api folder.

/// 4.2 importing and initializing Prisma
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/// 4.2 for a Next.js API route to handle requests, you need to export a function as default (called a request handler), 
/// 4.2 which receives the following parameters:
/// 4.2 req: An instance of the incoming HTTP request, plus some pre-built middlewares
/// 4.2 res: An instance of the server response object, plus some helper functions
export default async function handler(req, res) {
    // Create new home
    if (req.method === 'POST') {
      /// 4.2 Handle POST requests
        try {
            /// 4.2 retrieving the properties needed from the body of the request, req.body
            const { image, title, description, price, guests, beds, baths } =
              req.body;
            
            /// 4.2 call Prisma create function to perform the query in the database
            const home = await prisma.home.create({
              data: {
                image,
                title,
                description,
                price,
                guests,
                beds,
                baths,
              },
            });
            res.status(200).json(home);
          } catch (e) {
            res.status(500).json({ message: 'Something went wrong' });
          }
    }
    // HTTP method not supported!
    else {
      res.setHeader('Allow', ['POST']);
      res
        .status(405)
        .json({ message: `HTTP method ${req.method} is not supported.` });
    }
  }