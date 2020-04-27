import { Router } from 'express';
import { getRepository } from 'typeorm';
import UserModel from '../models/User';

import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const usersRepository = getRepository(UserModel);
  const users = await usersRepository.find();

  return response.json(users);
});

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const creatUser = new CreateUserService();

    const user = await creatUser.execute({
      name,
      email,
      password,
    });

    // removendo campo do retorno do json
    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default usersRouter;
