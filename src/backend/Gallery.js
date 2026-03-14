import { getStoredData, saveData } from './Initialiser';

async function getGallery() {
const data = await getStoredData();
return data?.natureGallery ?? [];
}

async function savePhoto(uri, title, location) {
const data = await getStoredData();
const newPhoto = {
    id: `img_${Date.now()}`,
    uri,
    title,
    date: new Date().toISOString().split('T')[0],
    location
};
data.natureGallery.push(newPhoto);
await saveData(data);
return newPhoto;
}

async function deletePhoto(id) {
const data = await getStoredData();
data.natureGallery = data.natureGallery.filter(photo => photo.id !== id);
await saveData(data);
}

export { getGallery, savePhoto, deletePhoto };