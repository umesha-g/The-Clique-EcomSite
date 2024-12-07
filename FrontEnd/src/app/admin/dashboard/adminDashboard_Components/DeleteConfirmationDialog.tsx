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
        <AlertDialog open={open} onOpenChange={onOpenChange} >
            <AlertDialogContent className={"rounded-none"}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {type}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this {type.toLowerCase()}? <br/> <span className={"text-red-500"}>This action cannot be undone.</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className={"rounded-none"}>No</AlertDialogCancel>
                    <AlertDialogAction className={"rounded-none"} onClick={onConfirm}>Yes</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmationDialog;