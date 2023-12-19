// Comments.jsx
import React from 'react';
import './RecipeCard.css';
import { useState, useRef } from 'react';

const Comments = ({ comments, currentUser }) => {

  const [commentsVisible, setCommentsVisible] = useState(false);
  const toggleCommentsVisibility = () => {
    
    console.log("current_user: "+currentUser)
    setCommentsVisible(!commentsVisible);
  };
  return (
    <>
    <div className="comment-class comments-section">
    <h3 onClick={toggleCommentsVisibility}>Comments</h3>
    <div className={`comments-list ${commentsVisible ? 'visible' : ''}`}>
      {comments.map((comment, index) => (
        <div key={index} className="comment">
            <p>{comment.user_id === currentUser ? 'You' : comment.user}</p>
          <p>{comment.commentText}</p>
          <p>{new Date(comment.time).toLocaleString()}</p>
        </div>
      ))}
    </div>
  </div>

  

  </>
  );
};

export default Comments;
