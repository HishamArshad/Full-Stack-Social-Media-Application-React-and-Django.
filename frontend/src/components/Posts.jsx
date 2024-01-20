import React from 'react';
import { useGetPostListUserQuery } from '../redux/api';
import { useRef } from 'react';
import { useObservable } from "@legendapp/state/react"

import Comments from './Comment';
import LikeButton from './Like';

const Posts = () => {
   
  // Use the hook directly without invoking it
  const { data, isLoading, error } = useGetPostListUserQuery();
  const renderCount = ++useRef(0).current
  // Handle loading state
  const state = useObservable(true)
  const toggleTruncate = () => {
    state.set(!state.get());
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }
console.log(renderCount)
  return (

    <div className='flex flex-col gap-8'>

    
      {data && data.map(post => (
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
  
        <button className="hover:bg-gray-50 rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx={12} cy={7} r={1} />
            <circle cx={12} cy={12} r={1} />
            <circle cx={12} cy={17} r={1} />
          </svg>
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

export default Posts;
