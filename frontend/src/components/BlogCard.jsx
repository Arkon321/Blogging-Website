import React, { useState } from 'react';
import './BlogCard.css';

const BlogCard = ({ blog, onLike, onDislike, onRate, onComment, onReport }) => {
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(blog._id, commentText); // Pass the comment to the parent for handling
      setCommentText('');
    }
  };

  const handleRate = () => {
    if (rating >= 1 && rating <= 5) {
      onRate(blog._id, rating); // Pass the rating to the parent for handling
    }
  };

  return (
    <div className="blog-card">
      <h3>{blog.title}</h3>
      <p><strong>Author:</strong> {blog.author}</p>
      <p>{blog.description}</p>

      {/* Image Section */}
      {blog.imageUrl && (
        <div className="blog-image">
          <img src={blog.imageUrl} alt={blog.title} style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}

      <div className="blog-actions">
        <button onClick={() => onLike(blog._id)}>👍 {blog.likes}</button>
        <button onClick={() => onDislike(blog._id)}>👎 {blog.dislikes}</button>

        <div className="rating-section">
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            placeholder="Rate 1-5"
          />
          <button onClick={handleRate}>Rate</button>
        </div>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit">💬</button>
        </form>

        <button className="report-btn" onClick={() => onReport(blog._id)}>🚩 Report</button>
      </div>

      {blog.comments?.length > 0 && (
        <div className="comments-list">
          <strong>Comments:</strong>
          <ul>
            {blog.comments.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
