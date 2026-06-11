import { Document, model, Schema, Types } from 'mongoose';

export interface IGalleryImage extends Document {
    title: string;
    description?: string;
    imageUrl: string;
    style?: Types.ObjectId;
    uploadedBy: Types.ObjectId;
    createdAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>({
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    style: { type: Schema.Types.ObjectId, ref: 'TattooStyle' },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default model<IGalleryImage>('GalleryImage', GalleryImageSchema);