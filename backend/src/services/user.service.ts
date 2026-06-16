import * as userDao from '../dao/user.dao';
import { toUserDTO } from '../mappers/user.mapper';
import { IUser } from '../models/user.model';

export const getAllUsers = async () => {
    const users = await userDao.findAllUsers();
    return users.map(toUserDTO);
};

export const getUserById = async (id: string) => {
    const user = await userDao.findUserById(id);
    if (!user) throw new Error('User not found');
    return toUserDTO(user);
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
    const user = await userDao.findUserById(id);
    if (!user) throw new Error('User not found');
    const updated = await userDao.updateUser(id, data);
    if (!updated) throw new Error('Update failed');
    return toUserDTO(updated);
};

export const deleteUser = async (id: string) => {
    const user = await userDao.findUserById(id);
    if (!user) throw new Error('User not found');
    await userDao.deleteUser(id);
};
