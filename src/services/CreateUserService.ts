import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';
import AppError from '../erros/AppError';
import UserModel from '../models/User';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({
    name,
    email,
    password,
  }: RequestDTO): Promise<UserModel> {
    const usersRepository = getRepository(UserModel);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('E-mail address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
