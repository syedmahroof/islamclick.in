import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Loader2, Save, X, Tag, User } from 'lucide-react';
import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

type ArticleFormData = {
    title: string;
    short_description: string;
    content: string;
    category_id: string;
    subcategory_id?: string;
    tags: string;
    author: string;
    status: 'draft' | 'published';
};

type Props = {
    article?: {
        id?: number;
    } & Partial<ArticleFormData>;
} & PageProps;

export default function ArticleForm({ auth, article = {} }: Props) {
    const isEdit = !!article?.id;
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Articles', href: '/articles' },
        { title: isEdit ? 'Edit Article' : 'Create Article', href: '#' },
    ];
    const { data, setData, post, put, processing, errors } = useForm<ArticleFormData>({
        title: article?.title || '',
        short_description: article?.short_description || '',
        content: article?.content || '',
        category_id: article?.category_id || '',
        subcategory_id: article?.subcategory_id || '',
        tags: article?.tags || '',
        author: article?.author || '',
        status: article?.status || 'draft',
    });

    const [editor, setEditor] = useState<ClassicEditor | null>(null);
    
    // Example categories - replace with actual data from your backend
    const categories = [
        { id: '1', name: 'Islam' },
        { id: '2', name: 'Faith' },
        { id: '3', name: 'Culture' },
        { id: '4', name: 'Fiqh' },
        { id: '5', name: 'History' },
        { id: '6', name: 'Fatwa' },
    ];
    
    const subcategories = [
        { id: '1', category_id: '1', name: 'Tawheed' },
        { id: '2', category_id: '1', name: 'Sunnah' },
        { id: '3', category_id: '4', name: 'Prayer' },
        { id: '4', category_id: '4', name: 'Fasting' },
    ];
    
    const filteredSubcategories = subcategories.filter(
        (subcat) => subcat.category_id === data.category_id
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (article?.id) {
            put(route('articles.update', article.id));
        } else {
            post(route('articles.store'));
        }
    };

    return (
        <AppLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEdit ? 'Edit Article' : 'Create New Article'}
                    </h1>
                </div>
            }
        >
            <Head title={isEdit ? 'Edit Article' : 'Create Article'} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4">
                    <Card>
                            <CardHeader>
                                <CardTitle>
                                    {article?.id ? 'Edit Article' : 'New Article'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">

                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2 space-y-6">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Article Content</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="title">Title *</Label>
                                                            <Input
                                                                id="title"
                                                                value={data.title}
                                                                onChange={(e) => setData('title', e.target.value)}
                                                                placeholder="Enter article title"
                                                                className="w-full"
                                                            />
                                                            {errors.title && (
                                                                <p className="text-sm text-red-500">{errors.title}</p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="short_description">Short Description *</Label>
                                                            <Textarea
                                                                id="short_description"
                                                                value={data.short_description}
                                                                onChange={(e) => setData('short_description', e.target.value)}
                                                                placeholder="A brief summary of the article"
                                                                rows={3}
                                                                className="w-full"
                                                            />
                                                            {errors.short_description && (
                                                                <p className="text-sm text-red-500">{errors.short_description}</p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Content *</Label>
                                                            <div className="border rounded-md overflow-hidden">
                                                                <CKEditor
                                                                    editor={ClassicEditor}
                                                                    data={data.content}
                                                                    onReady={editor => {
                                                                        setEditor(editor);
                                                                    }}
                                                                    onChange={(event: any, editor: ClassicEditor) => {
                                                                        const content = editor.getData();
                                                                        setData('content', content);
                                                                    }}
                                                                />
                                                            </div>
                                                            {errors.content && (
                                                                <p className="text-sm text-red-500">{errors.content}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-6">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>Categories</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="category">Category *</Label>
                                                            <Select 
                                                                value={data.category_id}
                                                                onChange={(e) => setData('category_id', e.target.value)}
                                                            >
                                                                <option value="">Select a category</option>
                                                                {categories.map((category) => (
                                                                    <option key={category.id} value={category.id}>
                                                                        {category.name}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                            {errors.category_id && (
                                                                <p className="text-sm text-red-500">{errors.category_id}</p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="subcategory">Subcategory</Label>
                                                            <Select 
                                                                value={data.subcategory_id || ''}
                                                                onChange={(e) => setData('subcategory_id', e.target.value)}
                                                                disabled={!data.category_id}
                                                            >
                                                                <option value="">Select a subcategory</option>
                                                                {filteredSubcategories.length > 0 ? (
                                                                    filteredSubcategories.map((subcategory) => (
                                                                        <option key={subcategory.id} value={subcategory.id}>
                                                                            {subcategory.name}
                                                                        </option>
                                                                    ))
                                                                ) : (
                                                                    <option value="" disabled>
                                                                        No subcategories available
                                                                    </option>
                                                                )}
                                                            </Select>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>Tags</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center">
                                                                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                                                                <Label htmlFor="tags">Tags</Label>
                                                            </div>
                                                            <Input
                                                                id="tags"
                                                                value={data.tags}
                                                                onChange={(e) => setData('tags', e.target.value)}
                                                                placeholder="tag1, tag2, tag3"
                                                            />
                                                            <p className="text-xs text-muted-foreground">
                                                                Separate tags with commas
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>Author</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center">
                                                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                                                <Label htmlFor="author">Author Name</Label>
                                                            </div>
                                                            <Input
                                                                id="author"
                                                                value={data.author}
                                                                onChange={(e) => setData('author', e.target.value)}
                                                                placeholder="Author name"
                                                            />
                                                            {errors.author && (
                                                                <p className="text-sm text-red-500">{errors.author}</p>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>Publish</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor="status">Status</Label>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm text-muted-foreground">
                                                                    {data.status === 'draft' ? 'Draft' : 'Published'}
                                                                </span>
                                                                <Switch
                                                                    id="status"
                                                                    checked={data.status === 'published'}
                                                                    onCheckedChange={(checked) =>
                                                                        setData('status', checked ? 'published' : 'draft')
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mt-6 flex justify-end space-x-2">
                                                            <Button variant="outline" asChild>
                                                                <Link href={route('articles.index')}>
                                                                    <X className="mr-2 h-4 w-4" />
                                                                    Cancel
                                                                </Link>
                                                            </Button>
                                                            <Button type="submit" disabled={processing}>
                                                                {processing ? (
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Save className="mr-2 h-4 w-4" />
                                                                )}
                                                                {article?.id ? 'Update Article' : 'Publish Article'}
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
        </AppLayout>
    );
}
