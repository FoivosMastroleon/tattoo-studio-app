export interface UserDTO {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'artist' | 'customer';
    phone?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

