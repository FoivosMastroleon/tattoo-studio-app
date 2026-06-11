import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  role: 'admin' | 'artist' | 'customer';
  phone?: string;
  address?: string;
  avatar?: string;  
  createdAt: Date;
  updatedAt: Date;

}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    role: { type: String, enum: ['admin', 'artist', 'customer'], default: 'customer' },
    phone: { type: String },
    address: { type: String },
    avatar: { type: String }
}, { timestamps: true
    
});

export default model<IUser>('User', UserSchema);
