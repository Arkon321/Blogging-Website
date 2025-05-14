const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/lifestyleBlogs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schemas
const blogSchema = new mongoose.Schema({
 title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: false },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  comments: { type: [String], default: [] },
  reported: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, default: 'user' }
});

const Blog = mongoose.model('Blog', blogSchema);
const User = mongoose.model('User', userSchema);

// Dummy users for testing
const seedUsers = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create([
      { email: 'admin@example.com', password: 'admin123', role: 'admin' },
      { email: 'user@example.com', password: 'user123', role: 'user' }
    ]);
    console.log('🧪 Dummy users added');
  }
};
seedUsers();

// Authentication
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const token = user.role === 'admin' ? 'admin-token' : 'user-token';
    res.json({ token, role: user.role, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
});

// Blog Routes
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/blogs', async (req, res) => {
  const { title, content, author, imageUrl } = req.body; // Added imageUrl
    console.log('Received blog data:', { title, content, author, imageUrl }); // Log data

  if (!title || !content || !author)
    return res.status(400).json({ message: 'Title, content, and author are required' });

  try {
    const newBlog = new Blog({ title, content, author, imageUrl }); // Save imageUrl
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  const { content, email, imageUrl } = req.body; // Include imageUrl here for update
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author !== email) return res.status(403).json({ message: 'Unauthorized' });

    blog.content = content;
    if (imageUrl) blog.imageUrl = imageUrl; // Only update imageUrl if provided
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const { email, role } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (role !== 'admin' && blog.author !== email)
      return res.status(403).json({ message: 'Only author or admin can delete' });

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Likes / Dislikes / Rating
app.post('/api/blogs/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog.likes++;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/blogs/:id/dislike', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog.dislikes++;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/blogs/:id/rate', async (req, res) => {
  const { rating } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);
    blog.rating = (blog.rating * blog.ratingCount + rating) / (blog.ratingCount + 1);
    blog.ratingCount += 1;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Comments
app.post('/api/blogs/:id/comment', async (req, res) => {
  const { comment } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);
    blog.comments.push(comment);
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Report / Unreport
app.post('/api/blogs/:id/report', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog.reported = true;
    await blog.save();
    res.json({ message: 'Blog reported for review' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/blogs/:id/unreport', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog.reported = false;
    await blog.save();
    res.json({ message: 'Blog unreported' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use(express.json());

// Admin Panel
app.get('/api/admin/reported-blogs', async (req, res) => {
  try {
    const reportedBlogs = await Blog.find({ reported: true });
    res.json(reportedBlogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
