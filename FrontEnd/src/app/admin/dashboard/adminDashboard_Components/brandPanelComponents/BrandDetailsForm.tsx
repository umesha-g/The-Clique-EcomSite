import React, { useEffect, useRef, useState } from 'react';
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
import { BrandRequest } from '@/api/admin/admin-brand-api';
import { getActiveDiscounts } from '@/api/discount-api';
import BrandLogoDropzone from './BrandLogoDropzone';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    discountId: z.string().optional(),
    logoFile: z.any().optional(),
    existingLogoUrl: z.string().optional(),
});

interface BrandDetailsFormProps {
    initialData: BrandRequest | null;
    onSubmit: (data: BrandRequest) => void;
}

const BrandDetailsForm: React.FC<BrandDetailsFormProps> = ({
                                                               initialData,
                                                               onSubmit,
                                                           }) => {
    const [discounts, setDiscounts] = useState<any[]>([]);
    const fileRef = useRef<File | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            discountId: initialData?.discountId || '',
            existingLogoUrl: initialData?.existingLogoUrl || '',
        },
    });

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const response = await getActiveDiscounts();
                setDiscounts(response);
            } catch (error) {
                console.error('Error fetching discounts:', error);
            }
        };
        fetchDiscounts();
    }, []);

    const handleFileChange = (file: File | null) => {
        fileRef.current = file;
    };

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        const brandData: BrandRequest = {
            ...data,
            logoFile: fileRef.current,
        };
        onSubmit(brandData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Brand Name</FormLabel>
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
                                            {discount.name} ({discount.discountPercentage}% off)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="logoFile"
                    render={() => (
                        <FormItem>
                            <FormLabel>Brand Logo</FormLabel>
                            <FormControl>
                                <BrandLogoDropzone
                                    onFileChange={handleFileChange}
                                    existingLogoUrl={form.getValues('existingLogoUrl')}
                                    file={fileRef.current}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full rounded-none">
                    {initialData ? 'Update Brand' : 'Create Brand'}
                </Button>
            </form>
        </Form>
    );
};

export default BrandDetailsForm;