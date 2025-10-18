import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, Trash2 } from 'lucide-react';

// Define the Category type
type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    order: number;
    parent_id: number | null;
    created_at: string;
    updated_at: string;
    children?: Category[];
};

interface CategoriesIndexProps {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    return (
        <AdminLayout>
            <Head title="Categories" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
                        <p className="text-muted-foreground">
                            Manage your content categories and subcategories
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.categories.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Categories</CardTitle>
                        <CardDescription>
                            View and manage all categories in your application
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <React.Fragment key={category.id}>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                {category.name}
                                            </TableCell>
                                            <TableCell>{category.slug}</TableCell>
                                            <TableCell>
                                                <Badge variant={category.is_active ? 'default' : 'secondary'}>
                                                    {category.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{category.order}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={route('admin.categories.edit', category.id)}>
                                                            <Pencil className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {/* Render subcategories if they exist */}
                                        {category.children?.map((subcategory) => (
                                            <TableRow key={subcategory.id} className="bg-muted/50">
                                                <TableCell className="pl-10 font-medium">
                                                    <span className="text-muted-foreground">↳</span> {subcategory.name}
                                                </TableCell>
                                                <TableCell>{subcategory.slug}</TableCell>
                                                <TableCell>
                                                    <Badge variant={subcategory.is_active ? 'default' : 'secondary'}>
                                                        {subcategory.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{subcategory.order}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={route('admin.categories.edit', subcategory.id)}>
                                                                <Pencil className="h-4 w-4" />
                                                                <span className="sr-only">Edit</span>
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing <strong>{categories.length}</strong> categories
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </AdminLayout>
    );
}
