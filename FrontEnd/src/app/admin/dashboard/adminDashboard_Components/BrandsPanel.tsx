import {
    BrandRequest,
    BrandResponse,
    createBrand,
    deleteBrand,
    updateBrand,
    updateBrandState,
} from '@/api/admin/admin-brand-api';
import {getAllBrands, getBrandById} from '@/api/brand-api';
import { getActiveDiscounts, MiniDiscountResponse } from '@/api/discount-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import React, {useEffect, useRef, useState} from 'react';
import BrandLogoDropzone from "@/app/admin/dashboard/adminDashboard_Components/BrandLogoDropzone";

const BrandsPanel: React.FC = () => {
    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [activeDiscounts, setActiveDiscounts] = useState<MiniDiscountResponse[]>([]);
    const [formData, setFormData] = useState<BrandRequest & {discountName?:string} & {discountPercentage?:number}>({
        name: '',
        description: '',
        discountId: '',
        discountName:'',
        discountPercentage:0,
        logoFile: null,
        existingLogoUrl:'',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const fileRef = useRef<File | null>(null);

    useEffect(() => {
        fetchBrands().then();
        fetchActiveDiscounts().then();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await getAllBrands();
            setBrands(response);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const fetchActiveDiscounts = async () => {
        try {
            const response = await getActiveDiscounts();
            setActiveDiscounts(response);
        } catch (error) {
            console.error('Error fetching active discounts:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const newRequest: BrandRequest = {
                name: formData.name,
                description: formData.description,
                discountId: formData.discountId || '',
                logoFile: formData.logoFile,
                existingLogoUrl: formData.existingLogoUrl,
            };

            if (newRequest.discountId === ' ') {
                newRequest.discountId = '';
            }

            if (isEditing && selectedBrandId) {
                await updateBrand(selectedBrandId, newRequest);
            } else {
                await createBrand(newRequest);
            }
            await fetchBrands();
            resetForm();
        } catch (error) {
            console.error('Error saving brand:', error);
        }
    };

    const handleDeleteBrand = async (id: string) => {
        try {
            await deleteBrand(id);
            await fetchBrands();
            if (selectedBrandId === id) {
                resetForm();
            }
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    const handleFileChange = (file: File | null) => {
        fileRef.current = file;
        setFormData({ ...formData, logoFile: file });
    };

    const handleEdit = async (brand: BrandResponse) => {
        try {
            const brandDetails = await getBrandById(brand.id);
            setIsEditing(true);
            setSelectedBrandId(brand.id);
            setFormData({
                name: brandDetails.name,
                description: brandDetails.description,
                discountId: brandDetails.discount?.id,
                discountName: brandDetails.discount?.name,
                discountPercentage: brandDetails.discount?.discountPercentage,
                logoFile: null,
                existingLogoUrl: brandDetails.logoUrl,
            });
        } catch (error) {
            console.error('Error fetching brand details:', error);
        }
    };

    const handleStateChange = async (id: string , newState:Boolean)=>{
        try{
            await updateBrandState(id,newState);
            await fetchBrands();
        }
        catch (error) {
            console.error('Error deleting discount:', error);
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            discountId: '',
            discountName:'',
            discountPercentage:0,
            logoFile: null,
            existingLogoUrl:'',
        });
        fileRef.current = null;
        setIsEditing(false);
        setSelectedBrandId(null);
  };

    return (
        <Card className="rounded-none">
            <CardHeader>
                <CardTitle>Brands Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 grid grid-cols-4 gap-4">
                    <Input
                        placeholder="Brand Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-none col-span-2"
                    />

                    <Select
                        value={formData.discountId || ''} // Add fallback for empty value
                        onValueChange={(value) =>
                            setFormData({
                                ...formData,
                                discountId: value,
                            })
                        }
                    >
                        <SelectTrigger className="rounded-none col-span-2">
                            <SelectValue placeholder={formData.discountName || "Select a Discount"} />
                        </SelectTrigger>
                        <SelectContent className={"rounded-none"}>
                            <SelectItem className={"rounded-none"} value=" ">No Discount</SelectItem>
                            {activeDiscounts.map((discount) => (
                                <SelectItem className={"rounded-none"} key={discount.id} value={discount.id}>
                                    {discount.name} ( {discount.discountPercentage}% off )
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        className=" rounded-none col-span-3"
                    />

                    <BrandLogoDropzone
                        onFileChange={handleFileChange}
                        existingLogoUrl={formData.existingLogoUrl}
                        file={fileRef.current}
                    />

                    <div className="space-x-2 col-span-2">
                        <Button
                            onClick={handleSubmit}
                            className="rounded-none"
                        >
                            {isEditing ? 'Update Brand' : 'Create Brand'}
                        </Button>
                        {isEditing && (
                            <Button variant="outline" onClick={resetForm} className="rounded-none">
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="rounded-none">Logo</TableHead>
                            <TableHead className="rounded-none">Name</TableHead>
                            <TableHead className="rounded-none">Description</TableHead>
                            <TableHead className="rounded-none">Discount</TableHead>
                            <TableHead className="rounded-none">State</TableHead>
                            <TableHead className="rounded-none">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {brands.map((brand) => (
                            <TableRow key={brand.id}>
                                <TableCell className="rounded-none">
                                {brand.logoUrl && (
                                    <img
                                        src={"http://localhost:8080"+brand.logoUrl}
                                        alt={`${brand.name} logo`}
                                        className="w-10 h-10 object-contain"
                                    />
                                )}
                                </TableCell>
                                <TableCell className="rounded-none">{brand.name}</TableCell>
                                <TableCell className="rounded-none">{brand.description}</TableCell>

                                <TableCell className="rounded-none">
                                    {brand.discount?.name}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleStateChange(brand.id , !brand.active)}
                                        variant={brand.active ? "default": "ghost"}
                                        className={` ${brand.active ? 'bg-green-600':''} rounded-none`}
                                    >
                                        {brand.active ? "Active": "Inactive"}
                                    </Button>
                                </TableCell>
                                <TableCell className="rounded-none">
                                    <div className="space-x-2">
                                        <Button
                                            onClick={() => handleEdit(brand)}
                                            variant="default"
                                            className="rounded-none"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteBrand(brand.id)}
                                            variant="destructive"
                                            className="rounded-none"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default BrandsPanel;