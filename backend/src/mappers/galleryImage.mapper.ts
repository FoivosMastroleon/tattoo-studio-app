import { IGalleryImage } from '../models/galleryImage.model';
import { GalleryImageDTO } from '../dto/galleryImage.dto';
import { ITattooStyle } from '../models/tattooStyle.model';
import { TattooStyleDTO } from '../dto/tattooStyle.dto';
import { IUser } from '../models/user.model';
import { UserDTO } from '../dto/user.dto';

export const toGalleryImageDTO = (galleryImage: IGalleryImage): GalleryImageDTO => ({
    const uploadedBy = galleryImage.uploadedBy as unknown as IUser;
    const style = galleryImage.style as unknown as ITattooStyle;

    return {
        id: String(galleryImage._id),
        title: galleryImage.title,
        description: galleryImage.description,
        imageUrl: galleryImage.imageUrl,
        style: style ? toTattooStyleDTO(style) : undefined,
        uploadedBy: uploadedBy ? toUserDTO(uploadedBy) : undefined,
        createdAt: galleryImage.createdAt,
    };
});