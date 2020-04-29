import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import AppError from '../erros/AppError';

import authConfig from '../config/auth';
import UserModel from '../models/User';

interface RequestDTO {
  email: string;
  password: string;
}

interface Response {
  user: UserModel;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: RequestDTO): Promise<Response> {
    const usersRepository = getRepository(UserModel);

    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMacthed = await compare(password, user.password);

    if (!passwordMacthed) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
