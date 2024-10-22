import {
  BrandRequest,
  BrandResponse,
  createBrand,
  deleteBrand,
} from '@/api/admin/admin-brand-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useEffect, useState } from 'react';

const BrandsPanel: React.FC = () => {
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [newBrand, setNewBrand] = useState<BrandRequest>({
    name: '',
    description: '',
    logoFile: null,
    isActive: true,
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    // This function is not provided in the API, so you'll need to implement it
    // For now, we'll use a placeholder
    setBrands([]);
  };

  const handleCreateBrand = async () => {
    try {
      await createBrand(newBrand);
      fetchBrands();
      setNewBrand({
        name: '',
        description: '',
        logoFile: null,
        isActive: true,
      });
    } catch (error) {
      console.error('Error creating brand:', error);
    }
  };

  // const handleUpdateBrand = async (id: string, updatedBrand: BrandRequest) => {
  //   try {
  //     await updateBrand(id, updatedBrand);
  //     fetchBrands();
  //   } catch (error) {
  //     console.error('Error updating brand:', error);
  //   }
  // };

  const handleDeleteBrand = async (id: string) => {
    try {
      await deleteBrand(id);
      fetchBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewBrand({ ...newBrand, logoFile: file });
    }
  };

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Brands Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Brand Name"
            value={newBrand.name}
            onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
            className="mb-2"
          />
          <Input type="file" onChange={handleFileChange} className="mb-2" />
          <Button onClick={handleCreateBrand}>Create Brand</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.name}</TableCell>
                <TableCell>
                  {brand.logoUrl && (
                    <img
                      src={brand.logoUrl}
                      alt={`${brand.name} logo`}
                      className="w-10 h-10 object-contain"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteBrand(brand.id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
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
