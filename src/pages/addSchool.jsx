import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Head from 'next/head';
// Import the icons we need
import { FaSchool, FaMapMarkedAlt, FaCity, FaGlobeAmericas, FaPhone, FaEnvelope, FaImage } from 'react-icons/fa';

export default function AddSchoolPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setMessage('');
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (key === 'image') formData.append(key, data.image[0]);
        else formData.append(key, data[key]);
    });

    try {
      const response = await fetch('/api/schools', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong');
      setMessage('School added successfully!');
      reset();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Add New School</title>
      </Head>
      {/* Added 'aurora-background' class for the new effect */}
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 aurora-background">
        {/* Added glass effect: bg-black/30 backdrop-blur-xl */}
        <div className="max-w-2xl w-full bg-black/30 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/10">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">Add New School</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="relative">
              <FaSchool className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="School Name" {...register('name', { required: 'Name is required' })} 
                className="pl-12 block w-full bg-gray-900/50 border-gray-700 text-gray-200 rounded-lg shadow-sm p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
              {errors.name && <p className="text-red-400 text-xs mt-1 pl-2">{errors.name.message}</p>}
            </div>
            
            <div className="relative">
              <FaMapMarkedAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Address" {...register('address', { required: 'Address is required' })} 
                className="pl-12 block w-full bg-gray-900/50 border-gray-700 text-gray-200 rounded-lg shadow-sm p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
              {errors.address && <p className="text-red-400 text-xs mt-1 pl-2">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <FaCity className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="City" {...register('city', { required: 'City is required' })} 
                  className="pl-12 block w-full bg-gray-900/50 border-gray-700 text-gray-200 rounded-lg shadow-sm p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
                {errors.city && <p className="text-red-400 text-xs mt-1 pl-2">{errors.city.message}</p>}
              </div>
              <div className="relative">
                <FaGlobeAmericas className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="State" {...register('state', { required: 'State is required' })} 
                  className="pl-12 block w-full bg-gray-900/50 border-gray-700 text-gray-200 rounded-lg shadow-sm p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
                {errors.state && <p className="text-red-400 text-xs mt-1 pl-2">{errors.state.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <FaPhone className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input type="number" placeholder="Contact Number" {...register('contact', { required: 'Contact is required' })} 
                  className="pl-12 block w-full bg-gray-900/50 border-gray-700 text-gray-200 rounded-lg shadow-sm p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
                {errors.contact && <p className="text-red-400 text-xs mt-1 pl-2">{errors.contact.message}</p>}
              </div>
              <div className="relative">
                <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="Email" {...register('email_id', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} 
                  className="pl-12 block w-full bg-gray-900/50 border-gray-700 text-gray-200 rounded-lg shadow-sm p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
                {errors.email_id && <p className="text-red-400 text-xs mt-1 pl-2">{errors.email_id.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-400 mb-2">School Image</label>
              <input type="file" id="image" {...register('image', { required: 'Image is required' })} 
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors duration-300 cursor-pointer"/>
              {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} 
              className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30">
              {isSubmitting ? 'Submitting...' : 'Add School'}
            </button>

            {message && <p className={`mt-4 text-center text-sm ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
          </form>
        </div>
      </div>
    </Layout>
  );
}