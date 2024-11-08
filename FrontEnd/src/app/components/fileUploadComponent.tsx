import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import {FileRefResponse} from "@/api/admin/admin-product-api";
import {prefix} from "@/utils/apiConfig";

interface FileUploadProps {
  maxFiles: number;
  onUpload: (files: File[]) => Promise<void>;
  existingFiles?: FileRefResponse[];
  onRemove?: (fileId: string) => Promise<void>;
  onSetAsCard?: (fileId: string) => Promise<void>;
  allowCardImage?: boolean;
}

const FileUpload:React.FC<FileUploadProps> = ({
  maxFiles,
  onUpload,
  existingFiles = [],
  onRemove,
  onSetAsCard,
  allowCardImage})=>
 {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (existingFiles.length + acceptedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    try {
      setUploading(true);
      setError(null);
      await onUpload(acceptedFiles);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [existingFiles.length, maxFiles, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5242880, // 5MB
    disabled: uploading
  });

  return (
    <div className="space-y-6 ">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-none p-8 text-center cursor-pointer 
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drop images here or click to upload
        </p>
        <p className="text-xs text-gray-500">
          Maximum {maxFiles} images, up to 5MB each
        </p>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {existingFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {existingFiles.map((file) => (
            <div key={prefix + file.standardUrl} className="relative group">
              <img
                src={prefix + file.thumbnailUrl}
                alt="Uploaded file"
                className="rounded-lg object-cover w-full aspect-square"
              />
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-none">
                <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                  {allowCardImage && !file.cardImage && (
                    <button
                      onClick={() => onSetAsCard?.(file.id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Set as card image"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onRemove?.(file.id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {file.cardImage && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-none">
                  Card Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;