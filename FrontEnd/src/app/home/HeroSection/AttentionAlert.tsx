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
                       Welcome to my practice e-commerce site! Please note that this website is for learning and practice purposes only. The products displayed are not real, and purchases you make will not be delivered.

<br></br> I kindly ask that you <span className="text-red-500"> avoid providing any real personal or payment information.</span> Feel free to explore the features and enjoy browsing.

Thank you for visiting!
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
