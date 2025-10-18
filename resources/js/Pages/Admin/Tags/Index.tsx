import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { useState } from 'react';

type Tag = {
    id: number;
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

type Props = {
    tags: {
        data: Tag[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
};

export default function TagsIndex({ tags }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this tag?')) {
            router.delete(route('admin.tags.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Tags" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Tags</h2>
                        <p className="text-muted-foreground">
                            Manage your content tags
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.tags.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Tag
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>All Tags</CardTitle>
                                <CardDescription>
                                    {tags?.meta?.total || 0} tags in total
                                </CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search tags..."
                                        className="w-full bg-background pl-8 md:w-[200px] lg:w-[336px]"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tags?.data?.length > 0 ? (
                                    tags.data.map((tag) => (
                                        <TableRow key={tag.id}>
                                            <TableCell className="font-medium">
                                                {tag.name}
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-sm bg-muted px-1 py-0.5 rounded">
                                                    {tag.slug}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                {tag.description || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={tag.is_active ? 'default' : 'secondary'}>
                                                    {tag.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(tag.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link href={route('admin.tags.edit', tag.id)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(tag.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="text-muted-foreground">
                                                No tags found. Create your first tag to get started.
                                            </div>
                                            <Button className="mt-4" asChild>
                                                <Link href={route('admin.tags.create')}>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    New Tag
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

