const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json()); //parses json request and then makes available under req.body
app.use(bodyParser.urlencoded({ extended: true })); //parses url encoded requests makes availble in req.body
app.use(express.static('public')); // serves files from public folder  / style.css

// Custom MW 1 Logs each request method and url 
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
  });
  
// Custome MW 2 modifies the header response
app.use((req, res, next) => {
    res.setHeader('Powered by', 'Express');
    next();
  });


  // Sample data
let users = [
    { id: 1, name: 'User 1', email: 'user1@example.com' },
    { id: 2, name: 'User 2', email: 'user2@example.com' },
  ];
  
  let posts = [
    { id: 1, userId: 1, title: 'Post 1', content: 'Content 1' },
    { id: 2, userId: 2, title: 'Post 2', content: 'Content 2' },
  ];
  
  let comments = [
    { id: 1, postId: 1, text: 'Comment 1' },
    { id: 2, postId: 2, text: 'Comment 2' },
  ];

// Routes
app.get('/', (req, res) => {   //responds to GET by sending views/index.html
    res.sendFile(path.join(__dirname, 'views', 'index.html')); 
  });

  // User Routes CRUD
app.get('/api/users', (req, res) => { // responds to GET by sending list of all users in json
    res.json(users);
  });
  
  app.post('/api/users', (req, res) => { // responds post request to create a new user 
    const newUser = { id: users.length + 1, name: req.body.name, email: req.body.email }; // req.body assigns unique ID to users array and responds with created user
    users.push(newUser);
    res.status(201).json(newUser);
  });
  
  app.patch('/api/users/:id', (req, res) => { // handles patch request to update user identifed by ID
    const user = users.find(u => u.id == req.params.id); // finds user by ID 
    if (user) {
      user.name = req.body.name || user.name; //updates name 
      user.email = req.body.email || user.email; //updates email
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  });
  
  app.delete('/api/users/:id', (req, res) => { //handles delete req remove user by ID
    users = users.filter(u => u.id != req.params.id);// filters user array excludes user with ID
    res.status(204).send(); // indicates deletion
  });


  // Comment Routes
  app.get('/api/comments', (req, res) => { //responds GET by sending back json of all comments 
    res.json(comments);
  });
  
  app.post('/api/comments', (req, res) => { //handles post request creates new comment 
    const newComment = { id: comments.length + 1, postId: req.body.postId, text: req.body.text }; // creates new comment assigns a unique ID adds it to comments array
    comments.push(newComment);
    res.status(201).json(newComment);
  });
  
  app.patch('/api/comments/:id', (req, res) => { //handles patch request
    const comment = comments.find(c => c.id == req.params.id);// finds comment by ID  
    if (comment) {
      comment.text = req.body.text || comment.text;//updates text with data from req.body 
      res.json(comment);
    } else {
      res.status(404).send('Comment not found');
    }
  });
  
  app.delete('/api/comments/:id', (req, res) => { // handles delete request by ID
    comments = comments.filter(c => c.id != req.params.id); // filters comments to exclude comments with specified ID
    res.status(204).send();
  });

  // Error-handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  // Start server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  