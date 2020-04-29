import fs from 'fs';
import path from 'path';

import { getRepository } from 'typeorm';
import UserModel from '../models/User';
import AppError from '../erros/AppError';
import uploadConfig from '../config/upload';

interface RequestDTO {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({
    user_id,
    avatarFilename,
  }: RequestDTO): Promise<UserModel> {
    const usersRepository = getRepository(UserModel);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change.', 401);
    }

    // Deletar avatar atual
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    // Atualizando avatar
    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
