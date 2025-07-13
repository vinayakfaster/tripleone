// components/ImageUpload.tsx
"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { IoCloseOutline } from "react-icons/io5";

declare global {
  var cloudinary: any;
}

type Props = {
  onChange: (urls: string[]) => void;
  value: string[]; // array of image URLs
};

function ImageUpload({ onChange, value }: Props) {
  const handleUpload = useCallback(
    (result: any) => {
      const url = result?.info?.secure_url;
      if (url && !value.includes(url)) {
        onChange([...value, url]);
      }
    },
    [onChange, value]
  );

  const handleRemove = (url: string) => {
    onChange(value.filter((img) => img !== url));
  };

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="tripleone"
      options={{ maxFiles: 10, multiple: true }}
    >
      {({ open }) => (
        <div className="space-y-4">
          <div
            onClick={() => open?.()}
            className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">Click to upload</div>
          </div>

          {value.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {value.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square w-full h-full rounded-md overflow-hidden group"
                >
                  <Image
                    src={url}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(url)}
                    className="absolute top-2 right-2 text-white bg-black/60 p-1 rounded-full hover:bg-black/80"
                  >
                    <IoCloseOutline size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
}

export default ImageUpload;
