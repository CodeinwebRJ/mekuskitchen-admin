import React, { useRef, ChangeEvent, DragEvent } from 'react';

export interface ImageItem {
  file?: File;
  url?: string;
  isPrimary?: boolean;
}

export interface Product {
  name: string;
  category: string;
  subCategory: string;
  subsubCategory: string;
  currency: string;
  price: string;
  sellingPrice: string;
  discount?: string;
  SKUName: string;
  stock: string;
  brand: string;
  shortDescription: string;
  description: string;
  images: ImageItem[];
  [key: string]: any;
}

interface TableFileUploaderProps {
  images: ImageItem[];
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
}

export default function TableFileUploader({ images, setProduct }: TableFileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newImages: ImageItem[] = selectedFiles.map((file) => ({ file }));

      setProduct((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newImages: ImageItem[] = droppedFiles.map((file) => ({ file }));

    setProduct((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newImages],
    }));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    setProduct((prev) => {
      const updatedImages = (prev.images || []).filter((_, idx) => idx !== index);
      return {
        ...prev,
        images: updatedImages,
      };
    });
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center w-full p-6 bg-white rounded-xl">
      {images.length > 0 && (
        <div className="mb-6 w-full grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <img
                src={image.file ? URL.createObjectURL(image.file) : image.url}
                alt="preview"
                className="w-full h-24 object-contain"
                onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)} // revoke url after load
              />
              {index === 0 && (
                <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-1 rounded-full z-10">
                  Primary
                </span>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove"
                  type="button"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className="w-full h-52 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleContainerClick}
      >
        {images.length === 0 ? (
          <div className="flex flex-col items-center text-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Drag & Drop or <span className="text-blue-600 hover:underline">Click to Upload</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">Supports images (PNG, JPG, etc.)</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Drop more images or click to add</p>
        )}
      </div>

      <input
        type="file"
        id="fileInput"
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </div>
  );
}
