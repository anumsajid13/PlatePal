// Comments.jsx
import React from 'react';

const Comments = ({ comments }) => {
  return (
    <div className="comments-section">
      <h3>Comments</h3>
      {comments.map((comment, index) => (
        <div key={index} className="comment">
          <p>{comment.user}</p>
          <p>{comment.commentText}</p>
          <p>{new Date(comment.time).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Comments;
