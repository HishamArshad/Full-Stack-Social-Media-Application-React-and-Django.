import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddComment from './AddComment';
import AddReply from './AddReply';
import AddLikeComment from './AddLikeComment';
import AddLikeReply from './AddLikeReply';

const Comments = ({ postId, userId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch token from wherever you store it (localStorage, Redux store, etc.)
        const storedData = localStorage.getItem('bool');
        const parsedData = JSON.parse(storedData);
        const tokenValue = parsedData.token;

        const response = await axios.get(`https://socialkindness-1c60d659e24d.herokuapp.com/api/comments/get_comments_for_post/?post_id=${postId}`, {
          headers: {
            Authorization: `Token ${tokenValue}`,
          },
        });

        setComments(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleReplyAdded = (newReply, commentId) => {
    // Update the comments array with the new reply
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      )
    );
  };

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error fetching comments: {error.message}</div>;
  }

  return (
    <div className="mt-4">
      <p className="text-blue-500 font-semibold cursor-pointer" onClick={handleToggleComments}>
        {showComments ? 'Hide Comments' : `Show Comments (${comments.length})`}
      </p>

      {showComments && (
        <div className='flex flex-col-reverse'>
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-center space-x-2 mt-2 hover:bg-gray-100 rounded-xl p-1">
              {console.log(comment)}
              <div>
              <div className='flex items-center space-x-2 mt-2'>
              <img
                src="https://placekitten.com/32/32"
                alt="User Avatar"
                className="w-6 h-6 rounded-full"
              />
              <div>
                <p className="text-gray-800 font-semibold">{comment.user_fullname}<sup className='text-xs font-light'>{comment.created_at}</sup> </p>
                <p className="text-gray-500 text-sm">{comment.content}</p>
                <AddLikeComment postId={comment.id}/>
                </div>
                </div>
                {/* Add replies */}
                {comment.replies && (
                  <div className="ml-8 flex  flex-col-reverse">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-center space-x-2 mt-2 hover:bg-gray-100 rounded-xl p-1">
                        <img
                          src="https://placekitten.com/32/32"
                          alt="User Avatar"
                          className="w-6 h-6 rounded-full"
                        />
                        <div>
                          <p className="text-gray-800 font-semibold">{reply.user_fullname} <sup className='text-xs font-light'>{reply.created_at}</sup> </p>
                          <p className="text-gray-500 text-sm">{reply.content}</p>
                          <AddLikeReply postId={reply.id}/>
                        </div>
                      </div>
                      
                    ))}
                  </div>
                )}
                <AddReply commentId={comment.id} userId={userId} onReplyAdded={(newReply) => handleReplyAdded(newReply, comment.id)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <AddComment postId={postId} userId={userId} content={comments} />

    </div>
  );
};

export default Comments;
