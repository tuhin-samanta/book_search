import {User} from '../models/index.js';
import {hashSync, compareSync} from 'bcrypt';
import jwt from 'jsonwebtoken';

// Function to validate email format
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Function to validate password
const isValidPassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
  return re.test(password);
};

export const register = (req, res) => {
  const { username, email, password } = req.body;

  // Validate name
  if (!username || username.trim().length === 0) {
    return res.status(400).json({ message: 'Name cannot be blank' });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate password strength
  if (!isValidPassword(password)) {
    return res.status(400).json({
      message: 'Password must be 8-15 characters long, include uppercase and lowercase letters, a number, and a special character.',
    });
  }

  // Check if email already exists
  User.findByEmail(email, (err, users) => {
    if (err) return res.status(500).json({ message: 'Error checking email' });
    if (users.length > 0) return res.status(400).json({ message: 'Email already in use' });

    // Hash password
    const hashedPassword = hashSync(password, 10);

    User.create({ username, email, password: hashedPassword }, (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error registering user' });}

      res.status(200).json({ message: 'User registered successfully' });
    });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, users) => {
    if (err || users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = users[0];

    if (compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  });
};