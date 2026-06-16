import { IUser } from '../models/user.model';
import { UserDTO } from '../dto/user.dto';

export const toUserDTO = (user: IUser): UserDTO => ({
    id: String(user._id),
    username: user.username,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});



