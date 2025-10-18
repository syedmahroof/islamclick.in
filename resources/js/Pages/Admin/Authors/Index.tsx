import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, Trash2, Eye, Calendar, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

type Author = {
  id: number;
  name: string;
  slug: string;
  email?: string;
  bio?: string;
  website?: string;
  twitter_handle?: string;
  facebook_username?: string;
  linkedin_profile?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  articles_count?: number;
  profile_image_url?: string;
};

type Props = {
  authors: {
    data: Author[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
};

export default function AuthorsIndex({ authors }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this author?')) {
      router.delete(route('admin.authors.destroy', id));
    }
  };

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    router.patch(route('admin.authors.toggle-status', id), {
      is_active: !currentStatus
    });
  };

  return (
    <AdminLayout>
      <Head title="Authors" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Authors</h2>
            <p className="text-muted-foreground">
              Manage your content authors and writers
            </p>
          </div>
          <Button asChild>
            <Link href={route('admin.authors.create')}>
              <Plus className="mr-2 h-4 w-4" />
              New Author
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Authors</CardTitle>
            <CardDescription>
              View and manage all authors in your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authors.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No authors found.
                    </TableCell>
                  </TableRow>
                ) : (
                  authors.data.map((author) => (
                    <TableRow key={author.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          {author.profile_image_url ? (
                            <img 
                              className="h-10 w-10 rounded-full" 
                              src={author.profile_image_url} 
                              alt={author.name} 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-sm font-medium text-amber-600">
                              {author.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{author.name}</div>
                            <div className="text-sm text-muted-foreground">@{author.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {author.email && (
                            <div className="text-sm text-muted-foreground">{author.email}</div>
                          )}
                          {author.website && (
                            <div className="text-sm">
                              <a 
                                href={author.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Website
                              </a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          {author.articles_count || 0} articles
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={author.is_active ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => handleToggleStatus(author.id, author.is_active)}
                        >
                          {author.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {format(new Date(author.created_at), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={route('admin.authors.show', author.id)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={route('admin.authors.edit', author.id)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(author.id)}
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
          {authors.meta && authors.meta.last_page > 1 && (
            <CardFooter className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">
                  {authors.meta ? Math.min((authors.meta.current_page - 1) * authors.meta.per_page + 1, authors.meta.total) : 0}
                </span> to{' '}
                <span className="font-medium">
                  {authors.meta ? Math.min(authors.meta.current_page * authors.meta.per_page, authors.meta.total) : 0}
                </span>{' '}
                of <span className="font-medium">{authors.meta?.total || 0}</span> authors
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!authors.meta || authors.meta.current_page === 1}
                  onClick={() => {
                    if (authors.meta) {
                      const prevPage = Math.max(1, authors.meta.current_page - 1);
                      router.get(route('admin.authors.index', { page: prevPage }));
                    }
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!authors.meta || authors.meta.current_page === authors.meta.last_page}
                  onClick={() => {
                    if (authors.meta) {
                      const nextPage = Math.min(authors.meta.last_page, authors.meta.current_page + 1);
                      router.get(route('admin.authors.index', { page: nextPage }));
                    }
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

