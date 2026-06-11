import { Document, model, Schema, Types } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    publishedBy: Types.ObjectId;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String }
}, { timestamps: true });

export default model<IPost>('Post', PostSchema);