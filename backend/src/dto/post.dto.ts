import { UserDTO } from './user.dto';

export interface PostDTO {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    publishedBy: UserDTO;
    createdAt: Date;
    updatedAt: Date;
}