import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import AddEditDiscountDialog from './DiscountPanelComponents/AddEditDiscountDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import {
  getAllDiscounts,
  deleteDiscount,
  updateDiscountState,
} from '@/api/admin/admin-discount-api';
import {Switch} from "@/components/ui/switch";

interface DiscountResponse {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

const DiscountsPanel: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountResponse[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountResponse | null>(null);
  const { toast } = useToast();

  const fetchDiscounts = async () => {
    try {
      const response = await getAllDiscounts();
      setDiscounts(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch discounts",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleAddDiscount = () => {
    setSelectedDiscount(null);
    setIsAddDialogOpen(true);
  };

  const handleEditDiscount = (discount: DiscountResponse) => {
    setSelectedDiscount(discount);
    setIsAddDialogOpen(true);
  };

  const handleDeleteClick = (discount: DiscountResponse) => {
    setSelectedDiscount(discount);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDiscount) return;

    try {
      await deleteDiscount(selectedDiscount.id);
      toast({
        title: "Success",
        description: "Discount deleted successfully"
      });
      fetchDiscounts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete discount",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedDiscount(null);
    }
  };

  const handleStateChange = async (id: string, newState: boolean) => {
    try {
      await updateDiscountState(id, newState);
      await fetchDiscounts();
      toast({
        title: "Success",
        description: `Discount ${newState ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update discount state",
        variant: "destructive"
      });
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
      <Card className="rounded-none w-[1500px]">
        <CardHeader>
          <CardTitle className={"text-xl"}>Discounts Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-10">
            <Button onClick={handleAddDiscount} className="rounded-none">
              Add Discount
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell className="font-medium">{discount.name}</TableCell>
                    <TableCell>{discount.description}</TableCell>
                    <TableCell>{discount.discountPercentage}%</TableCell>
                    <TableCell>{formatDateForDisplay(discount.startDate)}</TableCell>
                    <TableCell>{formatDateForDisplay(discount.endDate)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start">
                        <Switch
                            checked={discount.active}
                            onCheckedChange={(checked) => handleStateChange(discount.id, checked)}
                            className="data-[state=checked]:bg-green-600"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                            onClick={() => handleEditDiscount(discount)}
                            variant="outline"
                            size="icon"
                            className="rounded-none"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={() => handleDeleteClick(discount)}
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

          <AddEditDiscountDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              discount={selectedDiscount}
              onSuccess={fetchDiscounts}
          />

          <DeleteConfirmationDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              onConfirm={handleDeleteConfirm}
              type={"Discount"}
          />
        </CardContent>
      </Card>
  );
};

export default DiscountsPanel;