import TattooStyle, { ITattooStyle } from '../models/tattooStyle.model';

export const findAllTattooStyles = async (): Promise<ITattooStyle[]> => {
    return TattooStyle.find();
};

export const findTattooStyleById = async (id: string) => {
    return TattooStyle.findById(id);
};

export const findTattooStyleByName = async (name: string) => {
    return TattooStyle.findOne({ name });
};

export const createTattooStyle = async (tattooStyleData: Partial<ITattooStyle>) => {
    const tattooStyle = new TattooStyle(tattooStyleData);
    return tattooStyle.save();
};

export const updateStyleById = async (id: string, tattooStyleData: Partial<ITattooStyle>) => {
    return TattooStyle.findByIdAndUpdate(id, tattooStyleData, { new: true });
};

export const deleteStyleById = async (id: string) => {
    return TattooStyle.findByIdAndDelete(id);
};