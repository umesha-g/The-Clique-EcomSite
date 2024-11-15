import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { UserRequest, UserResponse, createUser, updateUserById } from '@/api/admin/admin-user-api';
import UserDetailsForm from './UserDetailsForm';

interface AddEditUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserResponse | null;
    onSuccess: () => void;
}

const AddEditUserDialog: React.FC<AddEditUserDialogProps> = ({
                                                                 open,
                                                                 onOpenChange,
                                                                 user,
                                                                 onSuccess,
                                                             }) => {
    const [userData, setUserData] = useState<UserRequest | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (open && user) {
            setUserData({
                firstName: user.firstName,
                lastName: user.lastName || '',
                email: user.email,
                phoneNumber: user.phoneNumber || '',
                currentPassword: '', // Clear password field for security
                existingDPUrl:user.UserDPUrl || '',
            });
        } else {
            setUserData(null);
        }
    }, [open, user]);

    const handleSubmit = async (data: UserRequest) => {
        try {
            if (user) {
                const updateRequest: UserRequest = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    currentPassword: '',
                };
                await updateUserById(user.id, updateRequest);
                toast({
                    title: "Success",
                    description: "User updated successfully"
                });
            } else {
                await createUser(data);
                toast({
                    title: "Success",
                    description: "User created successfully"
                });
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save user details",
                variant: "destructive"
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-none">
                <DialogHeader>
                    <DialogTitle>
                        {user ? 'Edit User' : 'Add New User'}
                    </DialogTitle>
                </DialogHeader>
                <UserDetailsForm
                    initialData={userData}
                    isEditing={!!user}
                    onSubmit={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddEditUserDialog;