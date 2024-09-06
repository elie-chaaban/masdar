import instance from '../../api/authenticated';
import {v4 as uuidv4} from 'uuid';

const uploadFaceImage = async (image) => {
  try {
    const imageId = uuidv4();
    var formData = new FormData();
    formData.set('image_id', imageId);
    formData.set('image', image);
    const {data} = await instance.post('security/upload/face', formData, {
      headers: {'Content-Type': `multipart/form-data; boundary=${formData._boundary}`}
    });
    return data.name;
  } catch (error) {
    throw error;
  }
};

export {uploadFaceImage};
