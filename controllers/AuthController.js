import UserModel from '../models/User.js';
import { getTokens } from '../utils/jwt.js';
import { checkPassword, generateHashPassword } from '../utils/password.js';
import cookie from 'cookie';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || !(await checkPassword({ password, hashedPassword: user.password }))) {
      throw new Error();
    }

    const { access_token, refresh_token } = getTokens(user._id);

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', refresh_token, {
        httpOnly: true,
        maxAge: process.env.REFRESH_TOKEN_AGE,
        path: '/',
        sameSite: 'none',
      }),
    );

    res.send({
      access_token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Не удалось войти в аккаунт',
    });
  }
}

export async function register(req, res) {
  try {
    const { email, name, image, password } = req.body;

    if (!email || !password || !name || !image) {
      throw new Error();
    }

    const existUser = await UserModel.count({ email });
    if (existUser !== 0) {
      throw new Error();
    }

    const hashedPassword = await generateHashPassword(password);
    const user = await UserModel.create({
      email,
      image,
      name,
      password: hashedPassword,
    });

    const { access_token, refresh_token } = getTokens(user._id);
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', refresh_token, {
        httpOnly: true,
        maxAge: process.env.REFRESH_TOKEN_AGE,
        path: '/',
        sameSite: 'none',
      }),
    );
    res.status(200).json({
      access_token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: 'Ошибка при регистрации',
    });
  }
}

export function logout(req, res) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('refreshToken', '', {
      httpOnly: true,
      maxAge: 0,
      path: '/',
      sameSite: 'none',
    }),
  );
  res.sendStatus(200);
}

export function refresh(req, res) {
  try {
    const { access_token } = getTokens(req.user_id);

    res.status(200).json({
      access_token,
    });
  } catch (error) {
    res.sendStatus(401);
  }
}

export async function getProfile(req, res) {
  try {
    const user = await UserModel.findById(req.user_id);

    if (!user) {
      throw new Error();
    }

    res.status(200).json({
      name: user.name,
      image: user.image,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Произошла ошибка при получении профиля.',
    });
  }
}
