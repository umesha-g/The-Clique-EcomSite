import React, {useCallback} from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload} from "lucide-react";
import Image from "next/image";
import {prefix} from "@/utils/apiConfig";

interface BrandLogoDropzoneProps {
    onFileChange: (file: File | null) => void;
    existingLogoUrl?: string;
    file: File | null;
}

const BrandLogoDropzone: React.FC<BrandLogoDropzoneProps> = ({ onFileChange, existingLogoUrl,file }) => {

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const selectedFile = acceptedFiles[0];
            onFileChange(selectedFile);
        },
        [onFileChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: undefined,
    });

    return (
        <div {...getRootProps()} className={`border-2 border-dashed p-4 rounded-none cursor-pointer ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}>
            <input {...getInputProps()} />
            {file ? (
                <div className="flex items-center space-x-4">
                    <Image src={URL.createObjectURL(file)} alt="Brand Logo" className="w-16 h-16 object-contain" width={100} height={100}/>
                    <p className="font-medium">{file.name}</p>
                </div>
            ) : existingLogoUrl ? (
                <div className="flex flex-col items-center">
                    <Image src={prefix +existingLogoUrl} alt="Existing Brand Logo" className="w-20 h-20 object-contain" width={100} height={100}/>
                    <p className="text-gray-500 text-xs text-center">Existing Logo</p>
                </div>
            ) : (
                <div className={"flex-col flex items-center"}>
                    <Upload size={40} className={"text-gray-500"}/>
                    <p className="text-gray-500 text-xs text-center"> Drag and drop a logo file, or click to select a file</p>
                </div>
            )}
        </div>
    );
};

export default BrandLogoDropzone;