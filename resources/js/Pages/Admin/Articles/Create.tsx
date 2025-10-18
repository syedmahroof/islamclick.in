import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, X } from 'lucide-react';
import CKEditorComponent from '@/components/ui/ckeditor';
import ReferencesInput from '@/components/ui/references-input';

type FormData = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category_id: string;
    subcategory_id: string;
    author_id: string;
    is_published: boolean;
    published_at: string;
    seo_title: string;
    seo_description: string;
    featured_image: File | null;
    references: Array<{
        title: string;
        link: string;
        description?: string;
    }>;
};

type FormProps = {
    categories: Array<{ id: number; name: string }>;
    authors: Array<{ id: number; name: string }>;
    subcategories: Array<{ id: number; name: string; category_id: number }>;
};

export default function ArticleCreate({ formData }: { formData: FormProps }) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category_id: '',
        subcategory_id: '',
        author_id: '',
        is_published: false,
        published_at: new Date().toISOString().split('T')[0],
        seo_title: '',
        seo_description: '',
        featured_image: null,
        references: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.articles.store'), {
            onSuccess: () => {
                // Handle success (e.g., show toast, redirect)
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('featured_image', file);
    };

    const generateSlug = () => {
        const slug = data.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-');
        setData('slug', slug);
    };

    return (
        <AdminLayout>
            <Head title="Create Article" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Create Article</h2>
                        <p className="text-muted-foreground">
                            Add a new article to your website
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.articles.index')}>
                            Back to Articles
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {/* Main Content */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Article Content</CardTitle>
                                    <CardDescription>
                                        The main content of your article
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            onBlur={generateSlug}
                                            placeholder="Enter article title"
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500">{errors.title}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="slug">URL Slug *</Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={generateSlug}
                                            >
                                                Generate
                                            </Button>
                                        </div>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            placeholder="article-url-slug"
                                        />
                                        {errors.slug && (
                                            <p className="text-sm text-red-500">{errors.slug}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="excerpt">Excerpt</Label>
                                        <Textarea
                                            id="excerpt"
                                            value={data.excerpt}
                                            onChange={(e) => setData('excerpt', e.target.value)}
                                            placeholder="A short excerpt that summarizes the article"
                                            rows={3}
                                        />
                                        {errors.excerpt && (
                                            <p className="text-sm text-red-500">{errors.excerpt}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content">Content *</Label>
                                        <CKEditorComponent
                                            value={data.content}
                                            onChange={(content) => setData('content', content)}
                                            placeholder="Write your article content here..."
                                        />
                                        {errors.content && (
                                            <p className="text-sm text-red-500">{errors.content}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SEO */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>SEO Settings</CardTitle>
                                    <CardDescription>
                                        Optimize your article for search engines
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="seo_title">SEO Title</Label>
                                        <Input
                                            id="seo_title"
                                            value={data.seo_title}
                                            onChange={(e) => setData('seo_title', e.target.value)}
                                            placeholder="Enter SEO title (max 70 characters)"
                                            maxLength={70}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {data.seo_title.length}/70 characters
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="seo_description">SEO Description</Label>
                                        <Textarea
                                            id="seo_description"
                                            value={data.seo_description}
                                            onChange={(e) => setData('seo_description', e.target.value)}
                                            placeholder="Enter SEO description (max 160 characters)"
                                            rows={3}
                                            maxLength={160}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {data.seo_description.length}/160 characters
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            {/* Publish */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Publish</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="is_published">Status</Label>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant={data.is_published ? 'default' : 'secondary'}>
                                                {data.is_published ? 'Published' : 'Draft'}
                                            </Badge>
                                            <Switch
                                                id="is_published"
                                                checked={data.is_published}
                                                onCheckedChange={(checked) => setData('is_published', checked)}
                                            />
                                        </div>
                                    </div>

                                    {data.is_published && (
                                        <div className="space-y-2">
                                            <Label htmlFor="published_at">Publish Date</Label>
                                            <Input
                                                id="published_at"
                                                type="datetime-local"
                                                value={data.published_at}
                                                onChange={(e) => setData('published_at', e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <Button type="submit" className="w-full" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                'Publish Article'
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Categories */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Categories</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category_id">Category *</Label>
                                        <Select
                                            value={data.category_id}
                                            onChange={(e) => {
                                                setData('category_id', e.target.value);
                                                setData('subcategory_id', '');
                                            }}
                                        >
                                            <option value="" disabled>
                                                Select a category
                                            </option>
                                            {formData.categories.map((category) => (
                                                <option key={category.id} value={String(category.id)}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.category_id && (
                                            <p className="text-sm text-red-500">{errors.category_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subcategory_id">Subcategory</Label>
                                        <Select
                                            value={data.subcategory_id}
                                            onChange={(e) => setData('subcategory_id', e.target.value)}
                                            disabled={!data.category_id}
                                        >
                                            <option value="" disabled>
                                                Select a subcategory
                                            </option>
                                            {formData.subcategories
                                                .filter((sub) => sub.category_id === Number(data.category_id))
                                                .map((subcategory) => (
                                                    <option key={subcategory.id} value={String(subcategory.id)}>
                                                        {subcategory.name}
                                                    </option>
                                                ))}
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Author */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Author</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Label htmlFor="author_id">Author *</Label>
                                        <Select
                                            value={data.author_id}
                                            onChange={(e) => setData('author_id', e.target.value)}
                                        >
                                            <option value="" disabled>
                                                Select an author
                                            </option>
                                            {formData.authors.map((author) => (
                                                <option key={author.id} value={String(author.id)}>
                                                    {author.name}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.author_id && (
                                            <p className="text-sm text-red-500">{errors.author_id}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Featured Image */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Featured Image</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="featured_image"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Plus className="w-8 h-8 mb-2 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        PNG, JPG, GIF (MAX. 5MB)
                                                    </p>
                                                </div>
                                                <input
                                                    id="featured_image"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                            </label>
                                        </div>
                                        {data.featured_image && (
                                            <div className="relative">
                                                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                                                    <img
                                                        src={URL.createObjectURL(data.featured_image)}
                                                        alt="Preview"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 rounded-full w-6 h-6"
                                                    onClick={() => setData('featured_image', null)}
                                                >
                                                    <X className="h-3 w-3" />
                                                    <span className="sr-only">Remove image</span>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* References */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>References</CardTitle>
                                    <CardDescription>
                                        Add external references and sources for your article
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ReferencesInput
                                        references={data.references}
                                        onChange={(references) => setData('references', references)}
                                        errors={errors}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
