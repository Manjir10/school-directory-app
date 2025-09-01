import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function ShowSchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const response = await fetch('/api/schools');
        if (!response.ok) {
          throw new Error('Failed to fetch schools');
        }
        const data = await response.json();
        setSchools(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSchools();
  }, []);

  if (loading) return (
    <Layout>
        <p className="text-center mt-8">Loading schools...</p>
    </Layout>
  );
  if (error) return (
    <Layout>
        <p className="text-center mt-8 text-red-500">Error: {error}</p>
    </Layout>
  );

  return (
    <Layout>
      <Head>
        <title>View Schools</title>
      </Head>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">School Directory</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {schools.map((school) => (
              <div key={school.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="w-full h-48 bg-gray-200">
                  <img 
                    src={school.image || '/placeholder-image.png'}
                    alt={`Image of ${school.name}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate" title={school.name}>{school.name}</h2>
                  <p className="text-sm text-gray-600 mt-1 truncate" title={school.address}>{school.address}</p>
                  <p className="text-sm text-gray-600 truncate" title={school.city}>{school.city}</p>
                </div>
              </div>
            ))}
          </div>

          {schools.length === 0 && (
            <p className="text-center text-gray-500 mt-12">No schools have been added yet. Add one to see it here!</p>
          )}
        </div>
      </div>
    </Layout>
  );
}