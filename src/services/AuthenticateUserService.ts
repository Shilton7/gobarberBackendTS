import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

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
      throw Error('Incorrect email/password combination.');
    }

    const passwordMacthed = await compare(password, user.password);

    if (!passwordMacthed) {
      throw Error('Incorrect email/password combination.');
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
