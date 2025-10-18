import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, Plus, Search, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Articles', href: '/articles' },
];

type Article = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    author: {
        name: string;
    };
    categories: Array<{ name: string }>;
};

type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    articles: {
        data: Article[];
        meta: PaginationMeta;
    };
} & PageProps;

export default function ArticlesIndex({ auth, articles }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this article?')) {
            router.delete(route('articles.destroy', id));
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            draft: 'bg-yellow-100 text-yellow-800',
            published: 'bg-green-100 text-green-800',
            archived: 'bg-gray-100 text-gray-800',
        };

        return (
            <Badge className={`${variants[status as keyof typeof variants]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <AppLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search articles..."
                                className="w-full bg-background pl-8 md:w-[200px] lg:w-[336px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button asChild>
                            <Link href={route('articles.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Article
                            </Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Articles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4">

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>All Articles</CardTitle>
                                <CardDescription>
                                    {articles?.meta?.total || 0} articles in total
                                </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                    Filter
                                </Button>
                                <Button variant="outline" size="sm">
                                    Sort
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Categories</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Published</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {articles?.data?.length > 0 ? (
                                    articles.data.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={route('articles.edit', article.id)}
                                                    className="hover:underline"
                                                >
                                                    {article.title}
                                                </Link>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {article.excerpt}
                                                </p>
                                            </TableCell>
                                            <TableCell>{article.author.name}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {article.categories.map((category, index) => (
                                                        <Badge key={index} variant="secondary">
                                                            {category.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(article.status)}</TableCell>
                                            <TableCell>
                                                {article.published_at
                                                    ? format(new Date(article.published_at), 'MMM d, yyyy')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link href={`/blog/${article.slug}`} target="_blank">
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link href={route('articles.edit', article.id)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(article.id)}
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
                                                No articles found. Create your first article to get started.
                                            </div>
                                            <Button className="mt-4" asChild>
                                                <Link href={route('articles.create')}>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    New Article
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {articles?.meta?.last_page > 1 && (
                        <CardFooter className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing <span className="font-medium">
                                    {articles.meta.per_page * (articles.meta.current_page - 1) + 1}
                                </span> to{' '}
                                <span className="font-medium">
                                    {Math.min(articles.meta.per_page * articles.meta.current_page, articles.meta.total)}
                                </span> of{' '}
                                <span className="font-medium">{articles.meta.total}</span> articles
                            </div>
                            <div className="flex space-x-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    disabled={articles.meta.current_page === 1}
                                    onClick={() => router.get(route('articles.index'), { page: articles.meta.current_page - 1 })}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={articles.meta.current_page === articles.meta.last_page}
                                    onClick={() => router.get(route('articles.index'), { page: articles.meta.current_page + 1 })}
                                >
                                    Next
                                </Button>
                            </div>
                        </CardFooter>
                    )}
                </Card>
                </div>
            </div>
        </AppLayout>
    );
}
