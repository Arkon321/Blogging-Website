import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPage.css";

function AdminPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  // Check if the user is an admin, otherwise redirect
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/");
    } else {
      fetchAllBlogs();
    }
  }, [navigate]);

  const fetchAllBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/reported-blogs"); // 👈 Fix here
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching reported blogs:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const toggleReportStatus = async (id, currentStatus) => {
    try {
      const action = currentStatus ? "unreport" : "report";
      const response = await axios.post(`http://localhost:5000/api/blogs/${id}/${action}`);
      setBlogs(blogs.map(blog => blog._id === id ? response.data : blog));
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Manage Lifestyle Blogs</h2>

      <section>
        {blogs.length === 0 ? (
          <p>No blogs available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Description</th>
                <th>Likes</th>
                <th>Dislikes</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Reported</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{blog.title}</td>
                  <td>{blog.author}</td>
                  <td>{blog.content}</td>
                  <td>{blog.likes}</td>
                  <td>{blog.dislikes}</td>
                  <td>{blog.rating?.toFixed(1)}</td>
                  <td>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                      {blog.comments?.map((comment, i) => (
                        <li key={i}>{comment}</li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ color: blog.reported ? "red" : "green" }}>
                    {blog.reported ? "Reported" : "Clean"}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        toggleReportStatus(blog._id, blog.reported)
                      }
                    >
                      {blog.reported ? "Unreport" : "Report"}
                    </button>
                    <button onClick={() => handleDelete(blog._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default AdminPage;
