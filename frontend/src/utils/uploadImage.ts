import { API_PATHS } from "./api";
import axiosInstance from "./axios";

const uploadImage = async (imageFile: any) => {
  const formData = new FormData();

  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error(`Error uploading the image : ${err}`);
    throw err;
  }
};

export default uploadImage;
