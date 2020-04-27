import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
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

    const token = sign({}, 'e3be0ce0d439adfbc9a1328ef570fb01', {
      subject: user.id,
      expiresIn: '1d',
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
