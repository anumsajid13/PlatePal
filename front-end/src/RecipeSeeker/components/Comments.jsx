// Comments.jsx
import React from 'react';
import './RecipeCard.css';
import { useState, useRef } from 'react';



const Comments = ({ comments, currentUser }) => {
  const [commentsVisible, setCommentsVisible] = useState(false);

  const toggleCommentsVisibility = () => {
    setCommentsVisible(!commentsVisible);
  };


  return (
    <>
      <div className="comment-class comments-section">
        <h3 onClick={toggleCommentsVisibility}>Comments</h3>
        <div className={`comments-list ${commentsVisible ? 'visible' : ''}`}>
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              {comment.user.profilePicture && typeof comment.user.profilePicture === 'string' ? (
                <img
                  src={comment.user.profilePicture}
                  alt="Profile"
                  style={{ width: '40px', height: '40px', borderRadius:"20px" }}
                />
              ) : (
                
                <img
                  src=""
                  alt="Profile"
                  style={{ width: '40px', height: '40px', borderRadius:"20px" }}
                />
                 
               
              )}
              <div className='profilepic-div' style={{display:"flex", flexDirection:"row"}}>
              <p style={{}}>{comment.user._id === currentUser ? 'You' : comment.user.name}</p>
              <p style={{marginLeft:"10px"}}>{comment.commentText}</p>
              </div>
              <p>{new Date(comment.time).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Comments;
