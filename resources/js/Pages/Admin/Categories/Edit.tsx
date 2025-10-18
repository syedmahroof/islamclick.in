import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryForm from './Form';
import { Category } from './Index';

interface EditCategoryProps {
    category: Category;
    categories: Array<{
        id: number;
        name: string;
        parent_id: number | null;
    }>;
}

export default function EditCategory({ category, categories }: EditCategoryProps) {
    return (
        <AdminLayout>
            <Head title={`Edit ${category.name}`} />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Edit Category</h2>
                        <p className="text-muted-foreground">
                            Update the category details below
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Category Details</CardTitle>
                        <CardDescription>
                            Update the details of this category
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CategoryForm category={category} categories={categories} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
