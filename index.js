import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import multer from 'multer';

import { FilmController, AuthController } from './controllers/index.js';
import { getUserId, verifyAccessToken, verifyRefreshToken } from './utils/jwt.js';
import { authValidation, uploadValidation } from './validations/index.js';
import validationErrors from './utils/validationErrors.js';

mongoose
  .connect(
    'mongodb+srv://root:koko66@cluster0.dmtkoqf.mongodb.net/kinonetx?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB success'))
  .catch((err) => console.log('DB error ', err));

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50000000,
  },
  fileFilter: (req, file, cb) => {
    const types = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!types.includes(file.mimetype)) {
      return cb(new Error('TYPE_ERROR'));
    }

    cb(null, true);
  },
});

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
dotenv.config();

// Films
app.get('/films', FilmController.getAll);
app.get('/films/:id', getUserId, FilmController.getById);
app.post('/film/save', verifyAccessToken, FilmController.saveFilm);
app.get('/bookmarks', verifyAccessToken, FilmController.getBookmarks);

// User
app.post('/auth/login', authValidation.loginValidation, validationErrors, AuthController.login);
app.post(
  '/auth/register',
  authValidation.registerValidation,
  validationErrors,
  AuthController.register,
);
app.get('/auth/logout', AuthController.logout);
app.get('/refresh', verifyRefreshToken, AuthController.refresh);
app.get('/profile', verifyAccessToken, AuthController.getProfile);

// other
app.post('/upload', upload.single('image'), uploadValidation.upload, (req, res) => {
  res.status(200).json({
    url: '/uploads/' + req.file.filename,
  });
});

app.listen(5000, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log('Server OK');
});
