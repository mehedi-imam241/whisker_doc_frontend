import axios from "axios";

export const uploadCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );

  const res = await axios.post(
    process.env.NEXT_PUBLIC_CLOUDINARY_API_LINK,
    data
  );
  return res;
};
