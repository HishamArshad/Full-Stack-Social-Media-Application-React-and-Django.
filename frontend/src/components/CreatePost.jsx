import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAllPostMutation } from '../redux/api';
const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [allPosts, {error, isLoading}] = useAllPostMutation();
  const [redirect, setRedirect] = useState(false)
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };
 
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const credentials = new FormData();
    credentials.append('title', title);
    credentials.append('description', description);
    credentials.append('image', image);
    setRedirect(true)
    try {
      await allPosts(credentials);
      // Reset form fields on successful submission
      setTitle('');
      setDescription('');
      setImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }
  if(redirect) {
    return <Navigate to="/"/>
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-12">
    <form onSubmit={handleFormSubmit} className="p-8 flex flex-col gap-4 rounded shadow-lg bg-[#121212] w-96">
      {error && (
        <div className="text-red-500">
          Error          {/* {(error.data.title)} */}
        </div>
      )}
  
      <label className="mb-2">
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </label>
      {error && (
        <div className="text-red-500">
          error {/* {(error.data.description)} */}
        </div>
      )}
      <label className="mb-2">
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </label>
      {error && (
        <div className="text-red-500">
          Error{/* {(error.data.image)} */}
        </div>
      )}
      <label className="mb-2">
        Image:
        <input
          type="file"
          onChange={handleImageChange}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </label>
  
      <button
        type="submit"
        disabled={isLoading}
        className={`bg-blue-500 mt-4 text-white p-2 rounded w-full ${isLoading && 'opacity-50 cursor-not-allowed'}`}
      >
        {isLoading ? 'Creating Post...' : 'Create Post'}
      </button>
    </form>
  </div>
  );
};

export default CreatePost;
