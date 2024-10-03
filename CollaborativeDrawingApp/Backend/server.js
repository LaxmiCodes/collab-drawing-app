const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
const port = 5000;
const JWT_SECRET = '79cffefa5e294e5e9f29c7101a54d43da8a1a13b8fdccaada15bd96eb226932212c6c43731c95e58a3141bdd0cd9d8b852c49cb6deee677e303e9910c5b36155bd656197f88994dcb5fe0933d135de0d3503eb57362fbe112f8020ef85f4b24ca71186d3066d03d262fb9e35548988d427bdd649338d74c604a1dfb056a3122229bbaa89a2a54fe1e1c69b5604b5b0fbd133a4f72df524e90db33a3b203bfd3cb4266e5a01fcd3b027c88c3ec99e89cb33a7c605b7822b5c582e680be3585a8a1f56df8ac4de29647d6e2c009115ed85ee1057ed7c54bd713b832e23f6ed037509e99e368768f13f65d9511fd4e49f8956de6ddd632d862ad7b6b5189079fe3d'; // Replace with a secure secret

app.use(bodyParser.json());

// Connection for  MySQL
const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root',      
  password: 'root',  
  database: 'user_auth'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});


app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Error checking user' });
    }
    if (result.length > 0) {
      return res.status(400).send({ message: 'User already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Error registering user' });
      }
      res.status(201).send({ message: 'User registered successfully' });
    });
  });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Error checking user' });
    }
    if (result.length === 0) {
      return res.status(400).send({ message: 'User not found' });
    }

    const user = result[0];

    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: 'Invalid password' });
    }

    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).send({ message: 'Login successful', token });
  });
});


app.get('/home', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to authenticate token' });
    }

    res.status(200).send({ message: 'Welcome to the Home page!', user: decoded });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
