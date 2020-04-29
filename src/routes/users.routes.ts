import { Router } from 'express';
import multer from 'multer';
import { getRepository } from 'typeorm';

import UserModel from '../models/User';
import uploadConfig from '../config/upload';
import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

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

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const uploadUserAvatar = new UpdateUserAvatarService();

    const user = await uploadUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  }
);

export default usersRouter;
