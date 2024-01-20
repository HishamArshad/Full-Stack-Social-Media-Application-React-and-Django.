import { useState, useEffect } from 'react';
import axios from 'axios';  // Add this import statement
import Comments from './Comment';
import { usePostDeleteMutation } from '../redux/api';
import LikeButton from './Like';
import { Navigate } from 'react-router-dom';
const YourPost = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletePostMutation] = usePostDeleteMutation();
  const [redirect, setRedirect] = useState(false)
  const handleDelete = async (postId) => {
    try {
      await deletePostMutation(postId);
      // Refetch posts after successful deletion
      setRedirect(true)
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const storedData = localStorage.getItem('bool');
        const parsedData = JSON.parse(storedData);
        const tokenValue = parsedData.token;

        const response = await axios.get('https://socialkindness-1c60d659e24d.herokuapp.com/api/posts/', {
          headers: {
            Authorization: `Token ${tokenValue}`,
          },
        });

        setPosts(response.data.reverse());   
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }
  if(redirect) {
    return <Navigate to="/"/>
  }
  return (

    <div className='flex flex-col mt-6 gap-8'>

    
      {posts.map(post => (
        <div key={post.id} className="flex items-center justify-center px-36">
  <div className="bg-white p-8 rounded-lg shadow-md w-[800px]">
 
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <img
          src="https://placekitten.com/40/40"
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="text-gray-800 font-semibold">{post.user_fullname}</p>
          <p className="text-gray-500 text-sm">{post.created_at}</p>
        </div>
      </div>
      <div className="text-gray-500 cursor-pointer">
         
          <button
              className="hover:bg-gray-50 rounded-full p-1"
              onClick={() => handleDelete(post.id)}
            >
              Delete
              {/* Add your delete icon/svg here */}
            </button>
      </div>
    </div>
 
    <div className="mb-4">
      <h1 className="text-gray-800 font-bold mb-3">{post.title}</h1>
      <p className="text-gray-800">{post.description}</p>
    </div>
 
    <div className="mb-4">
      <img
        src={post.image}
        alt="Post Image"
        className="w-full h-full object-cover rounded-md"
      />
    </div>
 
    <div className="flex items-center justify-between text-gray-500">
<LikeButton postId={post.id}/>
 
    </div>
    <hr className="mt-2 mb-2" />
    <p className="text-gray-800 font-semibold">Comment</p>
    <hr className="mt-2 mb-2" />
    <div className="mt-4">
    
<Comments postId={post.id} userId={post.user_id}/>
 
    </div>
  </div>
</div>

      ))}
    </div>
  );
};

export default YourPost;
