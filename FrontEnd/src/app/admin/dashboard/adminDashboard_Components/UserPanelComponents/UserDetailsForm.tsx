import React, {useRef} from 'react';
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
import { UserRequest} from '@/api/admin/admin-user-api';
import BrandLogoDropzone from "@/app/admin/dashboard/adminDashboard_Components/brandPanelComponents/BrandLogoDropzone";
import UserPictureDropzone
    from "@/app/admin/dashboard/adminDashboard_Components/UserPanelComponents/UserPictureDropzone";

const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    password: z.string().min(8, 'Password must be at least 8 Characters long').optional(),
    existingDPUrl:z.string().optional(),
    userPDFile:z.any().optional(),
});

interface UserDetailsFormProps {
    initialData: UserRequest | null;
    isEditing: boolean;
    onSubmit: (data: UserRequest) => void;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
                                                             initialData,
                                                             isEditing,
                                                             onSubmit,
                                                         }) => {
    const fileRef = useRef<File | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: initialData?.firstName || '',
            lastName: initialData?.lastName || '',
            email: initialData?.email || '',
            phoneNumber: initialData?.phoneNumber || '',
            password: '',
            existingDPUrl:initialData?.existingDPUrl || '',
        },
    });

    const handleFileChange = (file: File | null) => {
        fileRef.current = file;
    };

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        const userData: UserRequest = {
            ...data,
            userPDFile: fileRef.current,
        };
        onSubmit(userData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input {...field} className="rounded-none" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input {...field} className="rounded-none" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" className="rounded-none" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input {...field} className="rounded-none" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    className="rounded-none"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="userPDFile"
                    render={() => (
                        <FormItem>
                            <FormLabel>User Display Picture</FormLabel>
                            <FormControl>
                                <UserPictureDropzone
                                    onFileChange={handleFileChange}
                                    existingLogoUrl={form.getValues('existingDPUrl')}
                                    file={fileRef.current}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full rounded-none">
                    {isEditing ? 'Update User' : 'Create User'}
                </Button>
            </form>
        </Form>
    );
};

export default UserDetailsForm;