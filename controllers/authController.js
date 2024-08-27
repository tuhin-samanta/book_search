import {User} from '../models/index.js';
import {hashSync, compareSync} from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
  const { username, email, password } = req.body;

  // Hash password
  const hashedPassword = hashSync(password, 10);

  User.create({ username, email, password: hashedPassword }, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error registering user' });

    res.json({ message: 'User registered successfully' });
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
