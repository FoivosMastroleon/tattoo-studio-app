import { IPost } from '../models/posts.model';
import { IUser } from '../models/user.model';
import { PostDTO } from '../dto/post.dto';
import { toUserDTO } from './user.mapper';

export const toPostDTO = (post: IPost): PostDTO => {
  const publishedBy = post.publishedBy as unknown as IUser;

  return {
    id: String(post._id),
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
    publishedBy: toUserDTO(publishedBy),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};
