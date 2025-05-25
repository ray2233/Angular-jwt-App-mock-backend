// // server.js
// const jsonServer = require('json-server');
// const server = jsonServer.create();
// const auth = require('json-server-auth');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const router = jsonServer.router('db.json');
// const middlewares = jsonServer.defaults();
// const rules = require('./rules.json');

// const SECRET_KEY = 'mock_secret_key';
// const EXPIRES_IN = '10m'; 

// server.db = router.db;

// server.use(cors());
// server.use(middlewares);
// server.use(jsonServer.bodyParser);

// // 👇 Custom login to include token expiration
// server.post('/api/login', (req, res) => {
//   const { email, password } = req.body;
//   const user = server.db.get('users').find({ email, password }).value();

//   if (!user) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   const accessToken = jwt.sign(
//     { email: user.email, role: user.role, id: user.id },
//     SECRET_KEY,
//     { expiresIn: EXPIRES_IN }
//   );

//   // res.status(200).json({ accessToken, user: { email: user.email, role: user.role } });

//     res.status(200).json({
//     accessToken,
//     user: { email: user.email, role: user.role }
//   });
// });

// // 🔒 Middleware to protect routes and enforce role-based access
// server.use('/api', (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader?.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Missing token' });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.user = decoded;

//     const resource = req.url.split('?')[0].replace(/^\//, '').split('/')[0];
//     const allowedRoles = rules[resource];
//     if (allowedRoles && !allowedRoles.includes(decoded.role)) {
//       return res.status(403).json({ message: 'Forbidden: Role not authorized' });
//     }

//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// });

// server.use('/api', router);

// server.listen(3001, () => {
//   console.log('🚀 Mock API running on http://localhost:3001');
// });
// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const auth = require('json-server-auth');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const rules = require('./rules.json');

const SECRET_KEY = 'mock_secret_key';
const EXPIRES_IN = '10m';

server.db = router.db;

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

// 👇 Custom login with JWT
server.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = server.db.get('users').find({ email, password }).value();

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = jwt.sign(
    { email: user.email, role: user.role, id: user.id },
    SECRET_KEY,
    { expiresIn: EXPIRES_IN }
  );

  res.status(200).json({
  accessToken,
  user: {
    id: user.id,              
    email: user.email,
    role: user.role
    }
  });
});

// 🔐 Middleware for protected routes and RBAC
server.use('/api', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;

    const resource = req.url.split('?')[0].replace(/^\//, '').split('/')[0];
    const allowedRoles = rules[resource];
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden: Role not authorized' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// 👤 User-specific profile endpoint
server.get('/api/profile', (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(400).json({ message: 'User ID missing in token' });

  const userData = server.db.get('userData').get(`${userId}`).value();

  if (!userData) {
    return res.status(404).json({ message: 'Profile data not found' });
  }

  res.status(200).json(userData);
});

server.use('/api', router);

server.listen(3001, () => {
  console.log('🚀 Mock API running on http://localhost:3001');
});

