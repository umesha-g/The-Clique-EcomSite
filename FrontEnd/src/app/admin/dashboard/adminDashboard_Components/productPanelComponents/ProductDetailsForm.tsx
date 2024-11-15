import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IoIosClose } from "react-icons/io";
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
import { Gender, ProductRequest } from '@/api/admin/admin-product-api';
import { getAllCategories } from '@/api/category-api';
import { getActiveBrands } from '@/api/brand-api';
import {getActiveDiscounts, MiniDiscountResponse} from '@/api/discount-api';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ChromePicker } from 'react-color';
import {CategoryResponse} from "@/api/admin/admin-category-api";
import {BrandResponse} from "@/api/admin/admin-brand-api";

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().min(0.01, 'Price must be greater than 0'),
    stock: z.number().min(0, 'Stock cannot be negative'),
    gender: z.nativeEnum(Gender),
    colors: z.array(z.string()).min(1, 'At least one color is required'),
    sizes: z.array(z.string()).min(1, 'At least one size is required'),
    categoryId: z.string().min(1, 'Category is required'),
    brandId: z.string().optional(),
    discountId: z.string().optional(),
});

interface ProductDetailsFormProps {
    initialData: ProductRequest | null;
    onSubmit: (data: ProductRequest) => void;
}

const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({
                                                                   initialData,
                                                                   onSubmit,
                                                               }) => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [discounts, setDiscounts] = useState<MiniDiscountResponse[]>([]);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [selectedColorName, setSelectedColorName] = useState('');
    const [sizeInput, setSizeInput] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            stock: initialData?.stock || 0,
            gender: initialData?.gender || Gender.UNISEX,
            colors: initialData?.colors || [],
            sizes: initialData?.sizes || [],
            categoryId: initialData?.categoryId || '',
            brandId: initialData?.brandId || '',
            discountId: initialData?.discountId || '',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, brandsData, discountsData] = await Promise.all([
                    getAllCategories(),
                    getActiveBrands(),
                    getActiveDiscounts(),
                ]);
                setCategories(categoriesData);
                setBrands(brandsData);
                setDiscounts(discountsData);
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };
        fetchData();
    }, []);

    const handleColorAdd = () => {
        const currentColors = form.getValues('colors');
        const colorWithName = `${selectedColor},${selectedColorName}`;
        if (!currentColors.includes(colorWithName)) {
            form.setValue('colors', [...currentColors, colorWithName]);
        }
        setSelectedColor('#000000');
        setSelectedColorName('');
    };

    const handleColorRemove = (colorToRemove: string) => {
        const currentColors = form.getValues('colors');
        form.setValue(
            'colors',
            currentColors.filter((color) => color !== colorToRemove)
        );
    };

    const handleAddSize = () => {
        if (sizeInput.trim() !== '') {
            form.setValue('sizes', [...form.getValues('sizes'), sizeInput.trim()]);
            setSizeInput('');
        }
    };

    const handleRemoveSize = (index: number) => {
        const currentSizes = form.getValues('sizes');
        form.setValue('sizes', currentSizes.filter((_, i) => i !== index));
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full mx-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl className="rounded-none">
                                <Input {...field} />
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
                            <FormControl className="rounded-none">
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl className="rounded-none">
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl className="rounded-none">
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="colors"
                    render={() => (
                        <FormItem className="rounded-none">
                            <FormLabel className="rounded-none">Colors</FormLabel>
                            <div className="space-y-2 rounded-none">
                                <div className="flex items-center space-x-2 rounded-none">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="rounded-none"
                                                style={{
                                                    backgroundColor: selectedColor,
                                                    color: selectedColor === '#ffffff' ? '#000000' : '#ffffff',
                                                }}
                                            >
                                                Pick Color
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-none">
                                            <ChromePicker
                                                color={selectedColor}
                                                onChange={(color) => setSelectedColor(color.hex)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Input
                                        placeholder="Color Name"
                                        value={selectedColorName}
                                        onChange={(e) => setSelectedColorName(e.target.value)}
                                        className="rounded-none"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleColorAdd}
                                        className="rounded-none"
                                    >
                                        Add Color
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 rounded-none">
                                    {form.getValues('colors').map((color) => {
                                        const [hex, name] = color.split(',');
                                        return (
                                            <div
                                                key={color}
                                                className="flex items-center space-x-2 bg-gray-100 p-2 rounded-none"
                                            >
                                                <div
                                                    className="w-6 h-6 rounded-none"
                                                    style={{ backgroundColor: hex }}
                                                />
                                                <span className="rounded-none">{name}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleColorRemove(color)}
                                                    className="rounded-none"
                                                >
                                                    <IoIosClose size={"20"} />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <FormMessage className="rounded-none" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="sizes"
                    render={() => (
                        <FormItem>
                            <FormLabel>Sizes</FormLabel>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Add a new size"
                                            value={sizeInput}
                                            onChange={(e) => setSizeInput(e.target.value)}
                                            className="rounded-none "
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        onClick={handleAddSize}
                                        className="rounded-none"
                                    >
                                        Add Size
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {form.getValues('sizes').map((size, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-100 rounded-none px-2 py-1 flex items-center space-x-2"
                                        >
                                            <span>{size}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveSize(index)}
                                                className=""
                                            >
                                                <IoIosClose size={"20"} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl className="rounded-none">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category: any) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
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
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl className="rounded-none">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(Gender).map((gender) => (
                                            <SelectItem key={gender} value={gender}>
                                                {gender}
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
                        name="brandId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand (Optional)</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl className="rounded-none">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select brand" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value=" ">No Brand</SelectItem>
                                        {brands.map((brand: any) => (
                                            <SelectItem key={brand.id} value={brand.id}>
                                                {brand.name}
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
                        name="discountId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount (Optional)</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl className="rounded-none">
                                        <SelectTrigger>
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
                </div>

                <Button type="submit" className="w-full rounded-none">
                    Next
                </Button>
            </form>
        </Form>
    );
};

export default ProductDetailsForm;