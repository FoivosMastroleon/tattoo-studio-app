import { ITattooStyle } from '../models/tattooStyle.model';
import { TattooStyleDTO } from '../dto/tattooStyle.dto';

export const toTattooStyleDTO = (tattooStyle: ITattooStyle): TattooStyleDTO => ({
    id: String(tattooStyle._id),
    name: tattooStyle.name,
    description: tattooStyle.description,
    imageUrl: tattooStyle.imageUrl,
});

