import React, { useState } from 'react';
import axios from 'axios';

const AddComment = ({ postId, userId }) => {
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);

  const handleCommentSubmit = async () => {
    try {
      const storedData = localStorage.getItem('bool');
      const parsedData = JSON.parse(storedData);
      const tokenValue = parsedData.token;

      // Make a POST request to add a new comment
      const response = await axios.post(
        'https://socialkindness-1c60d659e24d.herokuapp.com/api/comments/',
        {
          post: postId,
          user: userId,
          content: commentContent,
        },
        {
          headers: {
            Authorization: `Token ${tokenValue}`,
          },
        }
      );

      // Handle success
      console.log('Comment added successfully:', response.data);

      // Append the new comment to the existing comments
      setComments((prevComments) => [response.data, ...prevComments]);

      // Clear the comment input field
      setCommentContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      {comments && comments.map((comment) => (
        <div key={comment.id} className="flex items-center space-x-2 mt-2 hover:bg-gray-100 rounded-xl p-1">
          <img
            src="https://placekitten.com/32/32"
            alt="User Avatar"
            className="w-6 h-6 rounded-full"
          />
          <div>
            <p className="text-gray-800 font-semibold">{comment.user_fullname} <sup className='text-xs font-light'>{comment.created_at}</sup> </p>
            <p className="text-gray-500 text-sm">{comment.content}</p>
          </div>
        </div>
      ))}

      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Add a comment..."
        rows="3"
        className="border p-2 rounded-md w-full"
      ></textarea>
      <button onClick={handleCommentSubmit} className="mt-2 bg-blue-500 text-white p-2 rounded">
        Add Comment
      </button>
    </div>
  );
};

export default AddComment;
