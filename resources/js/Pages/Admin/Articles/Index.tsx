import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, Trash2, Eye, Calendar, Folder, User } from 'lucide-react';
import { format } from 'date-fns';

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
  } | null;
  subcategory: {
    id: number;
    name: string;
  } | null;
  author: {
    id: number;
    name: string;
  } | null;
};

type Props = {
  articles: {
    data: Article[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
};

const statusVariant = (status: string) => {
  switch (status) {
    case 'published':
      return 'default';
    case 'draft':
      return 'secondary';
    case 'archived':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function ArticlesIndex({ articles }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this article?')) {
      router.delete(route('admin.articles.destroy', id));
    }
  };

  return (
    <AdminLayout>
      <Head title="Articles" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Articles</h2>
            <p className="text-muted-foreground">
              Manage your content articles and blog posts
            </p>
          </div>
          <Button asChild>
            <Link href={route('admin.articles.create')}>
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Articles</CardTitle>
            <CardDescription>
              View and manage all articles in your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No articles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  articles.data.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">
                        <div className="font-medium">{article.title}</div>
                        <div className="text-sm text-muted-foreground">{article.slug}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {article.category ? (
                            <div className="flex items-center">
                              <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{article.category.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                          {article.subcategory && (
                            <div className="flex items-center ml-6">
                              <span className="text-xs text-muted-foreground">└ {article.subcategory.name}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {article.author ? (
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            {article.author.name}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(article.status)}>
                          {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {article.published_at ? (
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {format(new Date(article.published_at), 'MMM d, yyyy')}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Draft</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={route('admin.articles.show', article.id)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={route('admin.articles.edit', article.id)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(article.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          {articles.meta.last_page > 1 && (
            <CardFooter className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">
                  {Math.min((articles.meta.current_page - 1) * articles.meta.per_page + 1, articles.meta.total)}
                </span> to{' '}
                <span className="font-medium">
                  {Math.min(articles.meta.current_page * articles.meta.per_page, articles.meta.total)}
                </span>{' '}
                of <span className="font-medium">{articles.meta.total}</span> articles
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={articles.meta.current_page === 1}
                  onClick={() => {
                    const prevPage = Math.max(1, articles.meta.current_page - 1);
                    router.get(route('admin.articles.index', { page: prevPage }));
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={articles.meta.current_page === articles.meta.last_page}
                  onClick={() => {
                    const nextPage = Math.min(articles.meta.last_page, articles.meta.current_page + 1);
                    router.get(route('admin.articles.index', { page: nextPage }));
                  }}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
