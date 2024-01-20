import React, { useState } from 'react';
import axios from 'axios';

const AddReply = ({ commentId, userId, onReplyAdded }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleReplySubmit = async () => {
    try {
      const storedData = localStorage.getItem('bool');
      const parsedData = JSON.parse(storedData);
      const tokenValue = parsedData.token;

      // Make a POST request to add a new reply
      const response = await axios.post(
        'https://socialkindness-1c60d659e24d.herokuapp.com/api/replies/',
        {
          comment: commentId,
          user: userId,
          content: replyContent,
        },
        {
          headers: {
            Authorization: `Token ${tokenValue}`,
          },
        }
      );

      // Handle success
      console.log('Reply added successfully:', response.data);

      // Call the callback function to inform the parent component about the new reply
      onReplyAdded(response.data);

      // Clear the reply input field
      setReplyContent('');

      // Hide the reply input field after successful submission
      setShowReplyInput(false);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleToggleReply = () => {
    // Toggle the state to show/hide the reply input field
    setShowReplyInput(!showReplyInput);
  };

  return (
    <div className="mt-2 ml-4">
      <button onClick={handleToggleReply} className="mb-2 text-blue-500">
        {showReplyInput ? 'Cancel Reply' : 'Reply'}
      </button>

      {showReplyInput && (
        <>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Add a reply..."
            rows="2"
            className="border rounded-md p-2 w-full"
          ></textarea>
          <button onClick={handleReplySubmit} className="mt-2 bg-blue-500 text-white p-2 rounded">
            Add Reply
          </button>
        </>
      )}
    </div>
  );
};

export default AddReply;
