import { useDropzone } from "react-dropzone";
import { IoMdCloseCircle } from "react-icons/io";
import { FiUploadCloud } from "react-icons/fi";
import { useState } from "react";

function ImageUploader({imageUrl,setImageFiles }) {
  const [imagePreview, setImagePreview] = useState(imageUrl ?? null);
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImageFiles(file);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Read the file as a data URL (base64)

      reader.onload = (e) => {
        setImagePreview(e.target.result); // Set the image source to the file data
      };
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop,multiple:false,accept: {
    'image/png': ['.png'],
    'image/jpg' : ['.jpg'],
    'image/jpeg' : ['.jpeg'],
  } });

  return (
    <div
      {...getRootProps()}
      style={{ border: "2px dashed gray", padding: "20px" }}
      className="flex justify-center items-center"
    >
      {imagePreview == null ? (
        <>
          <input {...getInputProps()}  />
          <div className="flex flex-col gap-1 justify-center items-center">
          <FiUploadCloud className="text-3xl font-bold" />
          <p className="text-center cursor-pointer"><span className="text-blue-700 font-bold">Click to upload</span> or Drag & drop</p>
          <span className="text-gray-400 text-[12px]">Upload only Image(.jpg,.png,.jpeg)</span>
          </div>
        </>
      ) : (
        <div className="relative">
          <IoMdCloseCircle onClick={()=>{setImageFiles(null),setImagePreview(null)}} className="absolute top-1 right-1 cursor-pointer text-[35px] text-black" />
          <img width={200} src={imagePreview} alt="" />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;