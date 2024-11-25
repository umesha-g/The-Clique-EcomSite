import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { AddressDialog } from "@/app/components/AddressDialog";
import { AddressResponse } from "@/api/address-api";

interface ShippingAddressProps {
    addresses: AddressResponse[];
    selectedAddress: string | null;
    onAddressChange: (addressId: string) => void;
    onAddressAdded: () => void;
}

export const ShippingAddress: React.FC<ShippingAddressProps> = ({
                                                                    addresses,
                                                                    selectedAddress,
                                                                    onAddressChange,
                                                                    onAddressAdded
                                                                }) => {
    return (
        <Card className="rounded-none">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                    Shipping Address
                </CardTitle>
                <CardDescription>
                    Select or add a shipping address
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {addresses.length > 0 ? (
                        <Select
                            value={selectedAddress || undefined}
                            onValueChange={onAddressChange}
                        >
                            <SelectTrigger className="rounded-none w-full">
                                <SelectValue placeholder="Select Address" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {addresses.map(address => (
                                    <SelectItem
                                        key={address.id}
                                        value={address.id}
                                        className="rounded-none"
                                    >
                                        <div className="flex items-center space-x-2 text-sm sm:text-base">
                                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="truncate">
                                                {`${address.addressLine}, ${address.city}, ${address.province}`}
                                            </span>
                                            {address.isDefault && (
                                                <Badge variant="outline">
                                                    Default
                                                </Badge>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            No saved addresses
                        </p>
                    )}

                    <AddressDialog
                        onAddressAdded={onAddressAdded}
                        trigger={
                            <Button className="rounded-none w-full sm:w-auto">
                                Add New Address
                            </Button>
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
};