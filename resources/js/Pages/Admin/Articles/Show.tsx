import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Folder, User, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

type Article = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    category_id: number;
    subcategory_id: number | null;
    author_id: number;
    is_published: boolean;
    published_at: string | null;
    seo_title: string | null;
    seo_description: string | null;
    featured_image_url: string | null;
    featured_image: {
        id: number;
        url: string;
        name: string;
    } | null;
    category: {
        id: number;
        name: string;
    };
    subcategory: {
        id: number;
        name: string;
    } | null;
    author: {
        id: number;
        name: string;
    };
    tags: Array<{ id: number; name: string }>;
    sources: Array<{ id: number; pivo: { context: string | null } }>;
    created_at: string;
    updated_at: string;
};

type Props = {
    article: Article;
};

export default function ArticleShow({ article }: Props) {
    const statusVariant = (isPublished: boolean) => {
        return isPublished ? 'default' : 'secondary';
    };

    const statusText = (isPublished: boolean) => {
        return isPublished ? 'Published' : 'Draft';
    };

    return (
        <AdminLayout>
            <Head title={`View Article: ${article.title}`} />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.articles.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Articles
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">View Article</h2>
                            <p className="text-muted-foreground">
                                {article.title}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.articles.edit', article.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* Article Content */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">{article.title}</CardTitle>
                                        <CardDescription className="mt-2">
                                            {article.excerpt || 'No excerpt provided'}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={statusVariant(article.is_published)}>
                                        {statusText(article.is_published)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {article.featured_image_url && (
                                    <div className="w-full">
                                        <img
                                            src={article.featured_image_url}
                                            alt={article.title}
                                            className="w-full h-64 object-cover rounded-md"
                                        />
                                    </div>
                                )}
                                
                                <div className="prose max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO Information */}
                        {(article.seo_title || article.seo_description) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>SEO Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {article.seo_title && (
                                        <div>
                                            <h4 className="font-semibold text-sm text-muted-foreground">SEO Title</h4>
                                            <p className="text-sm">{article.seo_title}</p>
                                        </div>
                                    )}
                                    {article.seo_description && (
                                        <div>
                                            <h4 className="font-semibold text-sm text-muted-foreground">Meta Description</h4>
                                            <p className="text-sm">{article.seo_description}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Article Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Article Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Created</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(article.created_at), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Last Updated</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(article.updated_at), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>

                                {article.published_at && (
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Published</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(article.published_at), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <Folder className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Category</p>
                                        <p className="text-sm text-muted-foreground">
                                            {article.category?.name || 'No category'}
                                        </p>
                                    </div>
                                </div>

                                {article.subcategory && (
                                    <div className="flex items-center space-x-2">
                                        <Folder className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Subcategory</p>
                                            <p className="text-sm text-muted-foreground">
                                                {article.subcategory.name}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Author</p>
                                        <p className="text-sm text-muted-foreground">
                                            {article.author?.name || 'No author'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tags</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {article.tags.map((tag) => (
                                            <Badge key={tag.id} variant="outline">
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Sources */}
                        {article.sources && article.sources.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sources</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {article.sources.map((source) => (
                                            <div key={source.id} className="text-sm">
                                                <p className="font-medium">Source #{source.id}</p>
                                                {source.pivo?.context && (
                                                    <p className="text-muted-foreground">{source.pivo.context}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}










