import React, { useState, useEffect } from 'react';
import { getUserAddresses, deleteAddress, AddressResponse } from '@/api/address-api';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Trash2, Edit, MapPin } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { AddressDialog } from '@/app/components/AddressDialog';

export const AddressBook = () => {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const userAddresses = await getUserAddresses();
      setAddresses(userAddresses);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch addresses"+error,
        variant: "destructive"
      });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);
      toast({ title: "Success", description: "Address deleted" });
      fetchAddresses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address"+error,
        variant: "destructive"
      });
    }
  };

  return (
      <div className="space-y-4">
        <div className="flex mb-4">
          <AddressDialog
              onAddressAdded={fetchAddresses}
              trigger={
                <Button className="rounded-none">
                  Add New Address
                </Button>
              }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
              <Card
                  key={address.id}
                  className="rounded-none border-2 hover:border-primary transition-colors"
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-xl">
                    <div className="flex items-center">
                      <MapPin className="mr-2" />
                      {address.isDefault && (
                          <span className="text-xs text-primary mr-2">DEFAULT</span>
                      )}
                      {address.receiverName}
                    </div>
                    <div className="flex space-x-2">
                      <AddressDialog
                          existingAddress={address}
                          onAddressAdded={fetchAddresses}
                          trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                      />
                      <Button
                          variant="destructive"
                          size="icon"
                          className="rounded-full"
                          onClick={() => handleDeleteAddress(address.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{address.addressLine}</p>
                  <p>{address.city}, {address.province} {address.postalCode}</p>
                  <p>{address.country}</p>
                  <p className="mt-2">{address.phoneNumber}</p>
                </CardContent>
              </Card>
          ))}
        </div>
      </div>
  );
};