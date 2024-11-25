"use client";
import React, { useState } from 'react';
import { z } from 'zod';
import { createAddress, updateAddress, AddressResponse, AddressRequest } from '@/api/address-api';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const addressSchema = z.object({
    receiverName: z.string()
        .min(2, { message: "Receiver name must be at least 2 characters" })
        .max(50, { message: "Receiver name must be less than 50 characters" }),

    phoneNumber: z.string().max(10, {message: "Invalid Phone Number Length"})
        .regex(/[0-9]/, { message: "Invalid phone number format" }),

    addressLine: z.string()
        .min(5, { message: "Address line must be at least 5 characters" })
        .max(100, { message: "Address line must be less than 100 characters" }),

    city: z.string()
        .min(2, { message: "City must be at least 2 characters" })
        .max(50, { message: "City must be less than 50 characters" }),

    province: z.string()
        .min(2, { message: "Province must be at least 2 characters" })
        .max(50, { message: "Province must be less than 50 characters" }),

    postalCode: z.string().min(3,{ message: "Postal Code must be at least 2 characters" }),

    country: z.string()
        .min(2, { message: "Country must be at least 2 characters" })
        .max(50, { message: "Country must be less than 50 characters" }),

    isDefault: z.boolean().optional()
});

interface AddressDialogProps {
    existingAddress?: AddressResponse | null;
    onAddressAdded?: () => void;
    trigger?: React.ReactNode;
}

export const AddressDialog: React.FC<AddressDialogProps> = ({
                                                                existingAddress = null,
                                                                onAddressAdded,
                                                                trigger
                                                            }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

    const [formData, setFormData] = useState<AddressRequest>({
        receiverName: existingAddress?.receiverName || '',
        phoneNumber: existingAddress?.phoneNumber || '',
        addressLine: existingAddress?.addressLine || '',
        city: existingAddress?.city || '',
        province: existingAddress?.province || '',
        postalCode: existingAddress?.postalCode || '',
        country: existingAddress?.country || '',
        isDefault: existingAddress?.isDefault || false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear validation error for the field being edited
        if (validationErrors[name]) {
            const newErrors = { ...validationErrors };
            delete newErrors[name];
            setValidationErrors(newErrors);
        }
    };

    const handleCreateOrUpdateAddress = async () => {
        try {
            // Validate the address data
            const result = addressSchema.safeParse(formData);

            if (!result.success) {
                // Set validation errors
                const errors = result.error.flatten().fieldErrors;
                const errorMap: {[key: string]: string} = {};

                Object.keys(errors).forEach(key => {
                    errorMap[key] = errors[key as keyof typeof errors]?.[0] || '';
                });

                setValidationErrors(errorMap);
                return;
            }

            // Clear previous validation errors
            setValidationErrors({});

            if (existingAddress) {
                await updateAddress(existingAddress.id, formData);
                toast({ title: "Success", description: "Address updated" });
            } else {
                await createAddress(formData);
                toast({ title: "Success", description: "Address added" });
            }

            // Call onAddressAdded callback if provided
            onAddressAdded?.();

            // Close dialog
            setIsDialogOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save address"+error,
                variant: "destructive"
            });
        }
    };

    const DefaultTrigger = (
        <Button
            onClick={() => setIsDialogOpen(true)}
            className="rounded-none"
        >
            {existingAddress ? 'Edit Address' : 'Add New Address'}
        </Button>
    );

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {trigger || DefaultTrigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {existingAddress ? 'Edit Address' : 'Add New Address'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Receiver Name</Label>
                            <Input
                                name="receiverName"
                                value={formData.receiverName}
                                onChange={handleChange}
                                className={`rounded-none ${validationErrors.receiverName ? 'border-destructive' : ''}`}
                            />
                            {validationErrors.receiverName && (
                                <p className="text-destructive text-sm mt-1">
                                    {validationErrors.receiverName}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>Phone Number</Label>
                            <Input
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`rounded-none ${validationErrors.phoneNumber ? 'border-destructive' : ''}`}
                            />
                            {validationErrors.phoneNumber && (
                                <p className="text-destructive text-sm mt-1">
                                    {validationErrors.phoneNumber}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label>Address Line</Label>
                        <Input
                            name="addressLine"
                            value={formData.addressLine}
                            onChange={handleChange}
                            className={`rounded-none ${validationErrors.addressLine ? 'border-destructive' : ''}`}
                        />
                        {validationErrors.addressLine && (
                            <p className="text-destructive text-sm mt-1">
                                {validationErrors.addressLine}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>City</Label>
                            <Input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`rounded-none ${validationErrors.city ? 'border-destructive' : ''}`}
                            />
                            {validationErrors.city && (
                                <p className="text-destructive text-sm mt-1">
                                    {validationErrors.city}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>Province</Label>
                            <Input
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                className={`rounded-none ${validationErrors.province ? 'border-destructive' : ''}`}
                            />
                            {validationErrors.province && (
                                <p className="text-destructive text-sm mt-1">
                                    {validationErrors.province}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>Postal Code</Label>
                            <Input
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                className={`rounded-none ${validationErrors.postalCode ? 'border-destructive' : ''}`}
                            />
                            {validationErrors.postalCode && (
                                <p className="text-destructive text-sm mt-1">
                                    {validationErrors.postalCode}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label>Country</Label>
                        <Input
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`rounded-none ${validationErrors.country ? 'border-destructive' : ''}`}
                        />
                        {validationErrors.country && (
                            <p className="text-destructive text-sm mt-1">
                                {validationErrors.country}
                            </p>
                        )}
                    </div>

                    <Button
                        onClick={handleCreateOrUpdateAddress}
                        className="w-full rounded-none"
                    >
                        {existingAddress ? 'Update Address' : 'Add Address'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};