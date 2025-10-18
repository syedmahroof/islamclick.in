import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryForm from './Form';

interface CreateCategoryProps {
    categories: Array<{
        id: number;
        name: string;
        parent_id: number | null;
    }>;
}

export default function CreateCategory({ categories }: CreateCategoryProps) {
    return (
        <AdminLayout>
            <Head title="Create Category" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Create New Category</h2>
                        <p className="text-muted-foreground">
                            Add a new category to organize your content
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Category Details</CardTitle>
                        <CardDescription>
                            Fill in the details below to create a new category
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CategoryForm categories={categories} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
