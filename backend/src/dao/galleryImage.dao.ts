import GalleryImage, { IGalleryImage } from '../models/galleryImage.model';

export const findAllGalleryImages = async (): Promise<IGalleryImage[]> => {
    return GalleryImage.find().sort({ createdAt: -1 }).populate('style uploadedBy');
};

export const findGalleryImageById = async (id: string) => {
    return GalleryImage.findById(id).populate('style uploadedBy');
};

export const createGalleryImage = async (galleryImageData: Partial<IGalleryImage>) => {
    const galleryImage = new GalleryImage(galleryImageData);
    return galleryImage.save();
}   

export const updateGalleryImageById = async (id: string, galleryImageData: Partial<IGalleryImage>) => {
    return GalleryImage.findByIdAndUpdate(id, galleryImageData, { new: true });
}

export const deleteGalleryImageById = async (id: string) => {
    return GalleryImage.findByIdAndDelete(id);
}