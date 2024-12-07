import React, { useState, useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AttentionAlert = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasShown = localStorage.getItem('attentionMessageShown');

        if (!hasShown) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('attentionMessageShown', 'true');
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Attention !</AlertDialogTitle>
                    <AlertDialogDescription>
                        This Site is made for Test Purpose Only. All Products in This site are Fake.
                        Please feel free to explore The Clique. Thank you for visiting.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction className={"rounded-none"} onClick={handleClose}>
                        OK, I Understand
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AttentionAlert;