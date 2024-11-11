import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CategoryRequest } from '@/api/admin/admin-category-api';
import { getActiveDiscounts, MiniDiscountResponse } from '@/api/discount-api';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    discountId: z.string().optional(),
});

interface CategoryDetailsFormProps {
    initialData: CategoryRequest | null;
    onSubmit: (data: CategoryRequest) => void;
}

const CategoryDetailsForm: React.FC<CategoryDetailsFormProps> = ({
                                                                     initialData,
                                                                     onSubmit,
                                                                 }) => {
    const [discounts, setDiscounts] = useState<MiniDiscountResponse[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            discountId: initialData?.discountId || '',
        },
    });

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const discountsData = await getActiveDiscounts();
                setDiscounts(discountsData);
            } catch (error) {
                console.error('Error fetching discounts:', error);
            }
        };
        fetchDiscounts();
    }, []);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input {...field} className="rounded-none" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} className="rounded-none" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="discountId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount (Optional)</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="rounded-none">
                                        <SelectValue placeholder="Select discount" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value=" ">No Discount</SelectItem>
                                    {discounts.map((discount) => (
                                        <SelectItem key={discount.id} value={discount.id}>
                                            {discount.name} ( {discount.discountPercentage}% off )
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full rounded-none">
                    {initialData ? 'Update Category' : 'Create Category'}
                </Button>
            </form>
        </Form>
    );
};

export default CategoryDetailsForm;