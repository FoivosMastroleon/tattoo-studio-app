import { Document, model, Schema } from 'mongoose';

export interface ITeamMember extends Document {
    name: string;
    role: string;
    imageUrl?: string;
    position?: string;
    order: number;
}

const TeamMemberSchema = new Schema<ITeamMember>({
    name: { type: String, required: true },
    role: { type: String, required: true },
    imageUrl: { type: String },
    position: { type: String },
    order: { type: Number, default: 0 },
});

export default model<ITeamMember>('TeamMember', TeamMemberSchema);
