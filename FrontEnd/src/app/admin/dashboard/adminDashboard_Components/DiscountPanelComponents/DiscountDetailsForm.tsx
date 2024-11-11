import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    discountPercentage: z.string()
        .min(1, 'Percentage is required')
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100, {
            message: 'Percentage must be between 0 and 100',
        }),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    active: z.boolean().default(true)
});

interface DiscountDetailsFormProps {
    initialData: any | null; // Replace 'any' with your DiscountRequest type
    onSubmit: (data: any) => void;
}

const DiscountDetailsForm: React.FC<DiscountDetailsFormProps> = ({
                                                                     initialData,
                                                                     onSubmit,
                                                                 }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            discountPercentage: initialData?.discountPercentage?.toString() || '',
            startDate: initialData?.startDate || '',
            endDate: initialData?.endDate || '',
        },
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        onSubmit({
            ...data,
            discountPercentage: Number(data.discountPercentage),
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount Name</FormLabel>
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
                    name="discountPercentage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount Percentage</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="rounded-none"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="date"
                                        className="rounded-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="date"
                                        className="rounded-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full rounded-none">
                    {initialData ? 'Update Discount' : 'Create Discount'}
                </Button>
            </form>
        </Form>
    );
};

export default DiscountDetailsForm;