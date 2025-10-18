import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Category } from './types';

interface CategoryFormProps {
    category?: Category;
    categories: Array<{
        id: number;
        name: string;
        parent_id: number | null;
    }>;
}

export default function CategoryForm({ category, categories }: CategoryFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        en_name: category?.en_name || '',
        slug: category?.slug || '',
        description: category?.description || '',
        is_active: category?.is_active ?? true,
        order: category?.order || 0,
        parent_id: category?.parent_id || null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (category) {
            put(route('admin.categories.update', category.id));
        } else {
            post(route('admin.categories.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Enter category name"
                        required
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="en_name">English Name *</Label>
                    <Input
                        id="en_name"
                        value={data.en_name}
                        onChange={(e) => setData('en_name', e.target.value)}
                        placeholder="Enter English name"
                        required
                    />
                    {errors.en_name && <p className="text-sm text-red-500">{errors.en_name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        placeholder="category-slug"
                    />
                    {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="parent_id">Parent Category</Label>
                    <select
                        id="parent_id"
                        value={data.parent_id || ''}
                        onChange={(e) => setData('parent_id', e.target.value ? parseInt(e.target.value) : null)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">No Parent (Top Level)</option>
                        {categories
                            .filter(cat => !category || cat.id !== category.id) // Don't allow selecting self as parent
                            .map((cat) => (
                                <option key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                </option>
                            ))}
                    </select>
                    {errors.parent_id && <p className="text-sm text-red-500">{errors.parent_id}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                        id="order"
                        type="number"
                        value={data.order}
                        onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                        min="0"
                    />
                    {errors.order && <p className="text-sm text-red-500">{errors.order}</p>}
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="is_active"
                        checked={data.is_active}
                        onCheckedChange={(checked) => setData('is_active', checked)}
                    />
                    <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={data.description || ''}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Enter a brief description of the category"
                        rows={3}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : 'Save Category'}
                </Button>
            </div>
        </form>
    );
}
