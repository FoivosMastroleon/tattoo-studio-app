import { Types } from 'mongoose';
import * as galleryDao from '../dao/galleryImage.dao';
import { toGalleryImageDTO } from '../mappers/galleryImage.mapper';
import { CreateGalleryImageInput } from '../validators/galleryImage.validator';

export const getAllImages = async () => {
    const images = await galleryDao.findAllGalleryImages();
    return images.map(toGalleryImageDTO);
};

export const createImage = async (uploadedBy: string, data: CreateGalleryImageInput) => {
    const created = await galleryDao.createGalleryImage({
        ...data,
        style: data.style ? new Types.ObjectId(data.style) : undefined,
        uploadedBy: new Types.ObjectId(uploadedBy),
    });
    const populated = await galleryDao.findGalleryImageById(String(created._id));
    if (!populated) throw new Error('Failed to create image');
    return toGalleryImageDTO(populated);
};

export const deleteImage = async (id: string) => {
    const image = await galleryDao.findGalleryImageById(id);
    if (!image) throw new Error('Image not found');
    await galleryDao.deleteGalleryImageById(id);
};
