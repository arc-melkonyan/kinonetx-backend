import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Невалидный емайл').isEmail(),
  body('password', 'Введите пароль. Минимальное количество символов - 5').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Невалидный емайл').isEmail(),
  body('password', 'Введите пароль. Минимальное количество символов - 5').isLength({ min: 5 }),
  body('name', 'Введите имя').isLength({ min: 2 }),
  body('image', 'Установить главную фотографию (аватарку)').isLength({ min: 10 }),
];
