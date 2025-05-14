import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LifestylePage.css';
import life1 from '../assets/life1.png';
import life2 from '../assets/life2.png';
import life3 from '../assets/life3.png';

const LifestylePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', author: '', content: '' });
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [ratingInputs, setRatingInputs] = useState({});
  const [selectedImageURL, setSelectedImageURL] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const staticBlogs = [
    { title: "Yoga & Meditation", author: "John Doe", content: "Discover yoga...", image: life1 },
    { title: "Healthy Eating", author: "Sarah Smith", content: "Learn healthy habits...", image: life2 },
    { title: "Productivity Hacks", author: "David Lee", content: "Time management tips...", image: life3 }
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.log('Error fetching blogs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const handleTextFormatting = (tag) => {
    const textarea = document.getElementById('blogContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      alert(`Please select text to ${tag}.`);
      return;
    }

    const selectedText = textarea.value.substring(start, end);
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    const formattedText = `<${tag}>${selectedText}</${tag}>`;
    setNewBlog({ ...newBlog, content: before + formattedText + after });
  };

  const handleImageInsert = () => {
    const url = document.getElementById('imageUrl').value.trim();
    if (url) {
      setSelectedImageURL(url);
      setIsPopupVisible(false);

    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!newBlog.title || !newBlog.author || !newBlog.content) return;
  console.log("Sending blog data:", { 
    ...newBlog, 
    imageUrl: selectedImageURL 
  });

  try {
    const response = await axios.post('http://localhost:5000/api/blogs', {
      ...newBlog,
      imageUrl: selectedImageURL
    });
    console.log("Server Response:", response.data); // Log response from server
    setBlogs([...blogs, response.data]);
    setNewBlog({ title: '', author: '', content: '' });
    setSelectedImageURL('');
  } catch (error) {
    console.log('Error posting blog:', error);
  }
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`);
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (error) {
      console.log('Error deleting blog:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/blogs/${id}`, { content: editContent });
      setBlogs(blogs.map(blog => blog._id === id ? response.data : blog));
      setEditId(null);
      setEditContent('');
    } catch (error) {
      console.log('Error updating blog:', error);
    }
  };

  const handleAction = async (id, action, data = {}) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/blogs/${id}/${action}`, data);
      setBlogs(blogs.map(blog => blog._id === id ? response.data : blog));
    } catch (error) {
      console.log(`Error performing ${action}:`, error);
    }
  };

  const toggleReport = (blog) => {
    const action = blog.reported ? 'unreport' : 'report';
    handleAction(blog._id, action);
  };

  return (
    <div className="lifestyle-page">
      <h2>Lifestyle Blogs</h2>
      <div className="intro">
        <p>Explore our curated blogs on healthy habits, mindful living, and wellness tips.</p>
      </div>

      {/* Static Blogs */}
      <section className="section">
        <h3>Popular Blogs</h3>
        <div className="blogs">
          {staticBlogs.map((blog, idx) => (
            <article key={idx} className="blog">
              <div className="person">
                <img src={blog.image} alt={blog.author} />
                <div className="personInfo">
                  <h4>{blog.title}  </h4>
                  <p>{blog.author}</p>
                </div>
              </div>
              <div className="content">{blog.content}</div>
            </article>
          ))}
        </div>
      </section>

      {/* Dynamic Blogs */}
      <section className="section my-blogs">
        <h3>My Blogs</h3>
        <div className="blogs">
          {blogs.length === 0 ? (
            <p>No blogs added yet. Create one below!</p>
          ) : (
            blogs.map((blog) => (
              <article key={blog._id} className={`blog ${blog.reported ? 'reported' : ''}`}>
                <div className="person">
                  <img src={life2} alt={blog.author} />
                  <div className="personInfo">
                    <h4>{blog.title}</h4>
                    <p>{blog.author}</p>
                  </div>
                </div>

                {/* Show blog image (imageUrl) below author info, only if available */}
                {blog.imageUrl && (
                  <div className="blog-image">
                    <img
                      src={blog.imageUrl}
                      alt="Blog visual"
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginTop: '10px' }}
                    />
                  </div>
                )}

                <div className="content">
                  {editId === blog._id ? (
                    <>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <button onClick={() => handleUpdate(blog._id)}>Save</button>
                    </>
                  ) : (
                    <>
                      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                      <button
                        onClick={() => {
                          setEditId(blog._id);
                          setEditContent(blog.content);
                        }}
                      >
                        Edit
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(blog._id)}>Delete</button>
                </div>

                <div className="actions">
                  <button onClick={() => handleAction(blog._id, 'like')}>👍 {blog.likes}</button>
                  <button onClick={() => handleAction(blog._id, 'dislike')}>👎 {blog.dislikes}</button>

                  <div className="rating-box">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={ratingInputs[blog._id] || ''}
                      placeholder="Rate"
                      onChange={(e) =>
                        setRatingInputs({ ...ratingInputs, [blog._id]: e.target.value })
                      }
                    />
                    <button
                      onClick={() => {
                        const ratingValue = parseInt(ratingInputs[blog._id]);
                        if (ratingValue >= 1 && ratingValue <= 5) {
                          handleAction(blog._id, 'rate', { rating: ratingValue });
                          setRatingInputs({ ...ratingInputs, [blog._id]: '' });
                        }
                      }}
                    >
                      Submit
                    </button>
                  </div>

                  <p>
                    Avg Rating:{' '}
                    {typeof blog.rating === 'number' ? blog.rating.toFixed(1) : 'N/A'}
                    ({blog.numRatings || 0} votes)
                  </p>

                  <input
                    type="text"
                    placeholder="Add comment"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleAction(blog._id, 'comment', { comment: e.target.value });
                        e.target.value = '';
                      }
                    }}
                  />
                  <ul>
                    {(blog.comments || []).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>


                  <button onClick={() => toggleReport(blog)}>
                    🚩 {blog.reported ? 'Unreport' : 'Report'}
                  </button>
                  {localStorage.getItem("role") === "admin" && (
                    <p className="status">
                      Status: <strong>{blog.reported ? 'Reported' : 'Clean'}</strong>
                    </p>
                  )}

                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* New Blog Form */}
      <section className="section">
        <h3>Create a New Blog</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={newBlog.title}
            onChange={handleChange}
          />
          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={newBlog.author}
            onChange={handleChange}
          />
          <textarea
            id="blogContent"
            name="content"
            placeholder="Write your blog here..."
            value={newBlog.content}
            onChange={handleChange}
            rows="6"
          />

          {selectedImageURL && (
            <div className="image-preview">
              <img src={selectedImageURL} alt="Image Preview" style={{ maxWidth: '100%' }} />
              <button
                type="button"
                onClick={() => setSelectedImageURL('')}
                className="delete-image-button"
              >
                ✖
              </button>
            </div>
          )}

          <div className="button-toolbar">
            <div className="left-buttons">
              <button type="button" onClick={() => handleTextFormatting('strong')}>Bold</button>  
              <button type="button" onClick={() => handleTextFormatting('em')}>Italic</button> 
              <button type="button" onClick={() => handleTextFormatting('u')}>Underline</button> 
              <button type="button" onClick={() => setIsPopupVisible(true)}>Insert Image</button>
            </div>
            <div className="right-buttons">
              <button type="submit">Add Blog</button>
            </div>
          </div>
        </form>

        {/* Image URL Popup */}
        {isPopupVisible && (
          <div className="popup">
            <div className="popup-content">
              <span className="close" onClick={() => setIsPopupVisible(false)}>&times;</span>
              <label htmlFor="imageUrl"> Enter Image URL:</label>
              <input type="text" id="imageUrl" />
              <button onClick={handleImageInsert}>Insert</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default LifestylePage;
