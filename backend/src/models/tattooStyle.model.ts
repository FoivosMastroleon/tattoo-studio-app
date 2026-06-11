import { Document, model, Schema } from 'mongoose';

export interface ITattooStyle extends Document {
    name: string; 
    description?: string;
    imageUrl?: string; 
}

const TattooStyleSchema = new Schema<ITattooStyle>({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    imageUrl: { type: String } 
});

export default model<ITattooStyle>('TattooStyle', TattooStyleSchema);