"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  bucket:
    | "destination-images"
    | "tour-images"
    | "hotel-images"
    | "car-images"
    | "category-icons"
    | "blog-images"
    | "cms-images";
  onUpload: (url: string) => void;
  onUploadMultiple?: (urls: string[]) => void;
  existingImages?: string[];
  onRemove?: (url: string) => void;
  multiple?: boolean;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({
  bucket,
  onUpload,
  onUploadMultiple,
  existingImages = [],
  onRemove,
  multiple = false,
  maxImages = 10,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    try {
      setError("");
      setUploading(true);

      const supabase = createClient();

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${bucket}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      if (multiple && onUploadMultiple) {
        onUploadMultiple([...existingImages, publicUrl]);
      } else {
        onUpload(publicUrl);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    if (!multiple && fileArray.length > 1) {
      setError("Only one file can be uploaded at a time");
      return;
    }

    if (multiple && existingImages.length + fileArray.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        setError("Please select image files only");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      await uploadFile(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    if (!multiple && fileArray.length > 1) {
      setError("Only one file can be uploaded at a time");
      return;
    }

    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        setError("Please select image files only");
        return;
      }

      await uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          uploading
            ? "border-gray-300 bg-gray-50"
            : "border-gray-300 hover:border-sky-500 hover:bg-sky-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          multiple={multiple}
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-2" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              {multiple
                ? `Click or drag to upload images (max ${maxImages})`
                : "Click or drag to upload an image"}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {existingImages.length > 0 && (
        <div
          className={`grid gap-4 ${
            multiple ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {existingImages.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border bg-gray-50"
            >
              <img
                src={imageUrl}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              {onRemove && (
                <button
                  onClick={() => onRemove(imageUrl)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
