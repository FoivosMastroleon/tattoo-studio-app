export type UserRole = 'admin' | 'artist' | 'customer';

export type User = {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    phone?: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
};

export type TattooStyle = {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;

};

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type Appointment = {
    id: string;
    customer: User;
    artist?: User;
    tattooStyle: TattooStyle;
    appointmentDate: string;
    timeSlot: string;
    status: AppointmentStatus;
    phone?: string;
    clientNotes?: string;
    artistNotes?: string;
    referenceImageUrl?: string;
    createdAt: string;
    updatedAt: string;
};



export type GalleryImage = {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    style?: TattooStyle;
    uploadedBy: User;
    createdAt: string;
    updatedAt: string;
};

export type Post = {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    publishedBy: User;
    createdAt: string;
    updatedAt: string;
};