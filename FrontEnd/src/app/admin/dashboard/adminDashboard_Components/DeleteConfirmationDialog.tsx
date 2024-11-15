import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    type:string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
                                                                               open,
                                                                               onOpenChange,
                                                                               onConfirm,
                                                                               type,
                                                                           }) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {type}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this {type.toLowerCase()}? <br/> <span className={"text-red-500"}>This action cannot be undone.</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Yes</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmationDialog;