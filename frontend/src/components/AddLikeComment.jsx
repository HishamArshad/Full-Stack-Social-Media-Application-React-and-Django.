import React, { useState, useEffect } from 'react';
import { useLikeCommentMutation } from '../redux/api';
import { useObservable } from '@legendapp/state/react';
import { persistObservable } from "@legendapp/state/persist"
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage"
const AddLikeComment = ({ postId }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [like, { isLoading }] = useLikeCommentMutation();
  const state = useObservable(false)
 
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await like(postId);
        setLikes(response.data.likes_count);
        setIsLiked(response.data.is_liked);
       
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    fetchLikes();
  }, [like, postId]);

  const handleLike = async () => {
    try {
      const response = await like(postId);
      console.log('Response:', response);
      setLikes(response.data.likes_count);
      setIsLiked();
      state.set(response.data.message === 'Comment liked successfully.')
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };
  

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLike}
        disabled={isLoading}
        className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1"
      >
        <svg
          className={`w-5 h-5 fill-current ${state.get() ? 'text-red-500' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span>{likes} Likes</span>
      </button>
    </div>
  );
};

export default AddLikeComment;
