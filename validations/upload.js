import multer from 'multer';

export const upload = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'Ошибка загрузки файла' });
  } else if (err.message === 'TYPE_ERROR') {
    return res.status(400).json({ error: 'Недопустимый тип файла' });
  }

  next();
};
