import { UserDTO } from './user.dto';
import { TattooStyleDTO } from './tattooStyle.dto';


export interface GalleryImageDTO {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    style?: TattooStyleDTO;
    uploadedBy: UserDTO;
    createdAt: Date;
}