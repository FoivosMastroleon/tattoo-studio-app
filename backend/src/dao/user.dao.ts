import User, { IUser } from '../models/user.model';


export const findAllUsers = async (): Promise<IUser[]> => {
     return await User.find();
}

export const findUserById = async (id: string) => {
     return await User.findById(id);
};

export const findUserByEmail = async (email: string) => {
     return await User.findOne({ email });
};

export const findUserByUsername = async (username: string) => {
     return await User.findOne({ username });
};

export const createUser = async (userData: Partial<IUser>) => {
     const user = new User(userData);
     return await user.save();
}

export const updateUser = async (id: string, userData: Partial<IUser>) => {
     return await User.findByIdAndUpdate(id, userData, { new: true });
};

export const deleteUser = async (id: string) => {
     return await User.findByIdAndDelete(id);
};

export const findUserByGoogleId = async (googleId: string) => {
     return await User.findOne({ googleId });
};