import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, X } from 'lucide-react';
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
        id?: number;
        title: string;
        link: string;
        description?: string;
    }>;
    _method?: string;
};

type FormProps = {
    categories: Array<{ id: number; name: string }>;
    authors: Array<{ id: number; name: string }>;
    sources: Array<{ id: number; title: string; author: string }>;
    subcategories: Array<{ id: number; name: string; category_id: number }>;
};

type Article = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category_id: number;
    subcategory_id: number | null;
    author_id: number;
    is_published: boolean;
    published_at: string;
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
    references: Array<{
        id: number;
        title: string;
        link: string;
        description?: string;
        order: number;
    }>;
};

type Props = {
    article: Article;
    formData: FormProps;
};

export default function ArticleEdit({ article, formData: initialFormData }: Props) {
    const [formData, setFormData] = React.useState<FormProps | null>(null);
    const [loading, setLoading] = React.useState(true);

    // Always call useForm hook at the top level
    const { data, setData, put, processing, errors } = useForm<FormData>({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || '',
        content: article.content || '',
        category_id: article.category_id.toString(),
        subcategory_id: article.subcategory_id?.toString() || '',
        author_id: article.author_id.toString(),
        is_published: article.is_published,
        published_at: article.published_at ? new Date(article.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        seo_title: article.seo_title || '',
        seo_description: article.seo_description || '',
        featured_image: null,
        references: article.references || [],
    });

    React.useEffect(() => {
        if (initialFormData) {
            setFormData(initialFormData);
            setLoading(false);
        }
    }, [initialFormData]);


    if (loading || !formData) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Convert boolean values for form submission
        const formDataForSubmit = {
            ...data,
            is_published: data.is_published ? 1 : 0,
        };
        
        // Remove remove_featured_image field since we're not using it
        delete formDataForSubmit.remove_featured_image;
        
        // Check if there's a file to upload
        const hasFile = data.featured_image instanceof File;
        
        // Debug: Log the form data
        console.log('=== FORM SUBMISSION DEBUG ===');
        console.log('Form data being sent:', formDataForSubmit);
        console.log('Has file:', hasFile);
        console.log('Featured image:', data.featured_image);
        console.log('Title:', formDataForSubmit.title);
        console.log('Category ID:', formDataForSubmit.category_id);
        console.log('Author ID:', formDataForSubmit.author_id);
        console.log('================================');
        
        if (hasFile) {
            // If there's a file, create FormData manually
            const formData = new FormData();
            
            // Add _method field for Laravel PUT requests
            formData.append('_method', 'PUT');
            
            // Append all form fields to FormData
            Object.keys(formDataForSubmit).forEach(key => {
                const value = formDataForSubmit[key];
                if (value !== null && value !== undefined) {
                    if (key === 'featured_image') {
                        // Only add featured_image if it's actually a file
                        if (value instanceof File) {
                            formData.append(key, value);
                            console.log(`Added file ${key}:`, value.name);
                        }
                    } else if (key === 'references' && Array.isArray(value)) {
                        // Handle references array
                        value.forEach((ref, index) => {
                            formData.append(`references[${index}][title]`, ref.title);
                            formData.append(`references[${index}][link]`, ref.link);
                            if (ref.description) {
                                formData.append(`references[${index}][description]`, ref.description);
                            }
                        });
                        console.log(`Added references array with ${value.length} items`);
                    } else if (Array.isArray(value)) {
                        // Handle other arrays
                        value.forEach((item, index) => {
                            formData.append(`${key}[${index}]`, item);
                        });
                        console.log(`Added array ${key} with ${value.length} items`);
                    } else {
                        // Convert boolean values to strings for FormData
                        const formValue = typeof value === 'boolean' ? (value ? '1' : '0') : value;
                        formData.append(key, formValue);
                        console.log(`Added field ${key}:`, formValue);
                    }
                }
            });
            
            // Debug: Log FormData contents
            console.log('=== FORMDATA CONTENTS ===');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
            console.log('==========================');
            
            // Use axios directly for file uploads
            axios.post(route('admin.articles.update', article.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
            })
            .then(response => {
                console.log('Success response:', response.data);
                router.visit(route('admin.articles.index'));
            })
            .catch(error => {
                console.error('Error updating article:', error.response?.data || error.message);
                if (error.response?.data?.errors) {
                    // Handle validation errors
                    console.error('Validation errors:', error.response.data.errors);
                }
            });
        } else {
            // If no file, use regular form submission without forceFormData
            put(route('admin.articles.update', article.id), {
                data: formDataForSubmit,
                onSuccess: () => {
                    router.visit(route('admin.articles.index'));
                },
                onError: (errors) => {
                    console.error('Error updating article:', errors);
                },
            });
        }
    };
    
    // Handle category change to update subcategories
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;
        setData('category_id', categoryId);
        setData('subcategory_id', ''); // Reset subcategory when category changes
        
        if (categoryId) {
            // Fetch subcategories for the selected category
            fetch(`/api/subcategories?category_id=${categoryId}`)
                .then(res => res.json())
                .then(data => {
                    setFormData(prev => ({
                        ...prev!,
                        subcategories: data
                    }));
                });
        } else {
            setFormData(prev => ({
                ...prev!,
                subcategories: []
            }));
        }
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
            <Head title={`Edit Article: ${article.title}`} />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Edit Article</h2>
                        <p className="text-muted-foreground">
                            Update article: {article.title}
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
                                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug *</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            placeholder="article-slug"
                                        />
                                        {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="excerpt">Excerpt</Label>
                                        <Textarea
                                            id="excerpt"
                                            value={data.excerpt}
                                            onChange={(e) => setData('excerpt', e.target.value)}
                                            placeholder="A brief summary of the article"
                                            rows={3}
                                        />
                                        {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content">Content *</Label>
                                        <CKEditorComponent
                                            value={data.content}
                                            onChange={(content) => setData('content', content)}
                                            placeholder="Write your article content here..."
                                        />
                                        {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SEO Settings */}
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
                                            placeholder="SEO optimized title (leave blank to use article title)"
                                        />
                                        {errors.seo_title && <p className="text-sm text-red-500">{errors.seo_title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="seo_description">Meta Description</Label>
                                        <Textarea
                                            id="seo_description"
                                            value={data.seo_description}
                                            onChange={(e) => setData('seo_description', e.target.value)}
                                            placeholder="A brief summary of the article for search results (leave blank to use excerpt)"
                                            rows={3}
                                        />
                                        {errors.seo_description && <p className="text-sm text-red-500">{errors.seo_description}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            {/* Publish Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Publish</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="is_published">Published</Label>
                                        <Switch
                                            id="is_published"
                                            checked={data.is_published}
                                            onCheckedChange={(checked) => setData('is_published', checked)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="published_at">Publish Date</Label>
                                        <Input
                                            id="published_at"
                                            type="date"
                                            value={data.published_at}
                                            onChange={(e) => setData('published_at', e.target.value)}
                                        />
                                        {errors.published_at && <p className="text-sm text-red-500">{errors.published_at}</p>}
                                    </div>

                                    <div className="pt-4">
                                        <Button type="submit" className="w-full" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                'Update Article'
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
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => {
                                                setData('category_id', e.target.value);
                                                setData('subcategory_id', '');
                                            }}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Select a category</option>
                                            {formData.categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subcategory_id">Subcategory</Label>
                                        <select
                                            id="subcategory_id"
                                            value={data.subcategory_id}
                                            onChange={(e) => setData('subcategory_id', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={!data.category_id}
                                        >
                                            <option value="">Select a subcategory</option>
                                            {formData.subcategories
                                                .filter((subcategory) => subcategory.category_id === parseInt(data.category_id || '0'))
                                                .map((subcategory) => (
                                                    <option key={subcategory.id} value={subcategory.id}>
                                                        {subcategory.name}
                                                    </option>
                                                ))}
                                        </select>
                                        {errors.subcategory_id && <p className="text-sm text-red-500">{errors.subcategory_id}</p>}
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
                                        <select
                                            id="author_id"
                                            value={data.author_id}
                                            onChange={(e) => setData('author_id', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Select an author</option>
                                            {formData.authors.map((author) => (
                                                <option key={author.id} value={author.id}>
                                                    {author.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.author_id && <p className="text-sm text-red-500">{errors.author_id}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Featured Image */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Featured Image</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="featured_image">Featured Image</Label>
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="featured_image"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        PNG, JPG, GIF (MAX. 10MB)
                                                    </p>
                                                </div>
                                                <Input
                                                    id="featured_image"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                            </label>
                                        </div>
                                        {data.featured_image && (
                                            <p className="text-sm text-green-600">
                                                ✓ New image selected: {data.featured_image.name}
                                            </p>
                                        )}
                                    </div>

                                    {errors.featured_image && <p className="text-sm text-red-500">{errors.featured_image}</p>}
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
