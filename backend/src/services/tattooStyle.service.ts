import * as styleDao from '../dao/tattooStyle.dao';
import { toTattooStyleDTO } from '../mappers/tattooStyle.mapper';
import { CreateStyleInput, UpdateStyleInput } from '../validators/tattooStyle.validator';

export const getAllStyles = async () => {
    const styles = await styleDao.findAllTattooStyles();
    return styles.map(toTattooStyleDTO);
};

export const createStyle = async (data: CreateStyleInput) => {
    const existing = await styleDao.findTattooStyleByName(data.name);
    if (existing) throw new Error('A style with this name already exists');
    const style = await styleDao.createTattooStyle(data);
    return toTattooStyleDTO(style);
};

export const updateStyle = async (id: string, data: UpdateStyleInput) => {
    const updated = await styleDao.updateStyleById(id, data);
    if (!updated) throw new Error('Style not found');
    return toTattooStyleDTO(updated);
};

export const deleteStyle = async (id: string) => {
    const style = await styleDao.findTattooStyleById(id);
    if (!style) throw new Error('Style not found');
    await styleDao.deleteStyleById(id);
};
