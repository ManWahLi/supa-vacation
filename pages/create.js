/// 4.2 Next.js will automatically create the corresponding page/route in our app. 
/// 4.2 We don't need to use any 3rd-party routing library like React Router, 
/// 4.2 since it comes with a built-in file-system based router.
/// 4.2 So, when a file is added to the pages/ folder, it's automatically available as a route.
import Layout from '@/components/Layout';
import ListingForm from '@/components/ListingForm';

/// 4.2 Call the API endpoint
/// 4.2 axios: a utility library to perform HTTP requests from the browser (and node.js environments)
import axios from 'axios';

const Create = () => {
  /// 4.2 the actual call to create a new record in the database through the addHome function.
  /// 4.2 call the post method from axios inside the addHome function to perform a HTTP POST request to our API endpoint api/homes. 
  /// 4.2 don't forget to pass the data from the form as well.
  const addHome = data => axios.post('/api/homes', data);

  return (
    <Layout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-xl font-medium text-gray-800">List your home</h1>
        <p className="text-gray-500">
          Fill out the form below to list a new home.
        </p>
        <div className="mt-8">
          <ListingForm
            buttonText="Add home"
            redirectPath="/"
            onSubmit={addHome}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Create;