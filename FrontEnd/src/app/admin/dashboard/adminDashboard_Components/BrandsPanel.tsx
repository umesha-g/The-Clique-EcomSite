import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from "lucide-react";
import { BrandResponse, deleteBrand, updateBrandState } from '@/api/admin/admin-brand-api';
import AddEditBrandDialog from './brandPanelComponents/AddEditBrandDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useToast } from '@/hooks/use-toast';
import {getAllBrands} from "@/api/brand-api";
import {Switch} from "@/components/ui/switch";

const BrandsPanel: React.FC = () => {
    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<BrandResponse | null>(null);
    const { toast } = useToast();

    const fetchBrands = async () => {
        try {
            const response = await getAllBrands();
            setBrands(response);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleAddBrand = () => {
        setSelectedBrand(null);
        setIsAddDialogOpen(true);
    };

    const handleEditBrand = (brand: BrandResponse) => {
        setSelectedBrand(brand);
        setIsAddDialogOpen(true);
    };

    const handleDeleteClick = (brand: BrandResponse) => {
        setSelectedBrand(brand);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedBrand) return;

        try {
            await deleteBrand(selectedBrand.id);
            toast({
                title: "Success",
                description: "Brand deleted successfully",
            });
            fetchBrands();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete brand",
                variant: "destructive"
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedBrand(null);
        }
    };

    const handleStateChange = async (id: string, newState: boolean) => {
        try {
            await updateBrandState(id, newState);
            await fetchBrands();
        } catch (error) {
            console.error('Error updating brand state:', error);
        }
    };

    return (
        <Card className="rounded-none">
            <CardHeader>
                <CardTitle>Brands Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-end items-center mb-4">
                    <Button onClick={handleAddBrand} className="rounded-none">
                        Add Brand
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {brands.map((brand) => (
                            <TableRow key={brand.id}>
                                <TableCell>
                                    {brand.logoUrl && (
                                        <img
                                            src={"http://localhost:8080" + brand.logoUrl}
                                            alt={`${brand.name} logo`}
                                            className="w-10 h-10 object-contain"
                                        />
                                    )}
                                </TableCell>
                                <TableCell>{brand.name}</TableCell>
                                <TableCell>{brand.description}</TableCell>
                                <TableCell>{brand.discount?.name}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col items-start">
                                        {/*<span className={`text-sm ${*/}
                                        {/*    discount.active ? 'text-green-600' : 'text-gray-500'}`}>*/}
                                        {/*    {discount.active ? 'Active' : 'Inactive'}*/}
                                        {/*</span>*/}
                                        <Switch
                                            checked={brand.active}
                                            onCheckedChange={(checked) => handleStateChange(brand.id, checked)}
                                            className="data-[state=checked]:bg-green-600"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-x-2">
                                        <Button
                                            onClick={() => handleEditBrand(brand)}
                                            variant="outline"
                                            size="icon"
                                            className="rounded-none"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteClick(brand)}
                                            variant="outline"
                                            size="icon"
                                            className="rounded-none"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <AddEditBrandDialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                    brand={selectedBrand}
                    onSuccess={fetchBrands}
                />

                <DeleteConfirmationDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onConfirm={handleDeleteConfirm}
                />
            </CardContent>
        </Card>
    );
};

export default BrandsPanel;