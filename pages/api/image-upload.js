/// 4.5 use the Supabase JS client to upload image
import { createClient } from '@supabase/supabase-js';

/// 4.5 for unique file name generation
import { nanoid } from 'nanoid';

/// 4.5 for decoding
import { decode } from 'base64-arraybuffer';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/// 4.5 Next.js defaults every API route has body parsing enabled with a maximum size allowed for the parsed body of 1MB
/// 4.5 export a config object from our file with a new size to customize the default API config per route and increase the maximum size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // Upload image to Supabase
  if (req.method === 'POST') {
      /// 4.5 retrieve the image data from the request's body and check that it is not empty:
      let { image } = req.body;

      if (!image) {
        return res.status(500).json({ message: 'No image provided' });
      }
      
      try {
          /// 4.5 check the image data as it should be encoded in Base64 
          const contentType = image.match(/data:(.*);base64/)?.[1];
          const base64FileData = image.split('base64,')?.[1];
          
          if (!contentType || !base64FileData) {
            return res.status(500).json({ message: 'Image data not valid' });
          }

          /// 4.5 Generate a unique filename using nanoid package
          const fileName = nanoid();
          const ext = contentType.split('/')[1];
          const path = `${fileName}.${ext}`;

          /// 4.5 Upload the image to Supabase
          /// 4.5 provide the bucket's name with the SUPABASE_BUCKET env, the file path, and the decoded Base64 data along with the contentType
          const { data, error: uploadError } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .upload(path, decode(base64FileData), {
              contentType,
              upsert: true,
          });

          if (uploadError) {
            console.log(uploadError);
            throw new Error('Unable to upload image to storage');
          }

          /// 4.5 Once the image has been successfully uploaded
          /// 4.5 we can construct its public URL and return it to the client who initiated the HTTP request.
          const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${data.path}`;

          return res.status(200).json({ url });
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