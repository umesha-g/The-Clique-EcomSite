import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/api/user-api';
import { toast } from '@/hooks/use-toast';
import { prefix } from '@/utils/apiConfig';
import {UserRequest} from "@/api/admin/admin-user-api";

interface ProfilePictureUploaderProps {
    currentPictureUrl?: string;
    onPictureUpdate: (newPictureUrl: string) => void;
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
                                                                           currentPictureUrl,
                                                                           onPictureUpdate
                                                                       }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        handleUpload(file);
    };

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        multiple: false,
        accept: undefined,
        noClick: true,
        noKeyboard: true
    });

    const handleUpload = async (file: File) => {
        try {
            const updateRequest: UserRequest = {
                userDPFile:file
            };

            const updatedUser = await updateUser(updateRequest);

            if (updatedUser.userDPUrl) {
                onPictureUpdate(updatedUser.userDPUrl);
                toast({
                    title: "Profile Picture Updated",
                    description: "Your profile picture has been successfully updated."
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to update profile picture`,
                variant: "destructive"
            });
        }
    };

    const pictureToShow = selectedFile
        ? URL.createObjectURL(selectedFile)
        : prefix + currentPictureUrl;

    return (
        <div className=" ring-2 ring-offset-2 ring-neutral-700 rounded-full relative w-32 h-32" {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                    src={pictureToShow}
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full rounded-full"
                />
            </div>
            <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={open}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-100"
            >
                <Camera className="w-4 h-4 text-gray-600" />
            </Button>
        </div>
    );
};

export default ProfilePictureUploader;