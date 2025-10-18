import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function Create({ parentCategories }: { parentCategories: Array<{ id: number; name: string }> }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    en_name: '',
    slug: '',
    description: '',
    is_active: true,
    order: 0,
    icon: '',
    parent_id: null as number | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.categories.store'));
  };

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Create Category
        </h2>
      }
    >
      <Head title="Create Category" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  {/* English Name */}
                  <div>
                    <label htmlFor="en_name" className="block text-sm font-medium text-gray-700">
                      English Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="en_name"
                      value={data.en_name}
                      onChange={(e) => setData('en_name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.en_name && <p className="mt-1 text-sm text-red-600">{errors.en_name}</p>}
                  </div>

                  {/* Slug */}
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                      Slug
                    </label>
                    <input
                      type="text"
                      id="slug"
                      value={data.slug}
                      onChange={(e) => setData('slug', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="auto-generated if empty"
                    />
                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                  </div>

                  {/* Parent Category */}
                  <div>
                    <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">
                      Parent Category
                    </label>
                    <select
                      id="parent_id"
                      value={data.parent_id || ''}
                      onChange={(e) => setData('parent_id', e.target.value ? Number(e.target.value) : null)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">-- No Parent --</option>
                      {parentCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.parent_id && <p className="mt-1 text-sm text-red-600">{errors.parent_id}</p>}
                  </div>

                  {/* Order */}
                  <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                      Order
                    </label>
                    <input
                      type="number"
                      id="order"
                      value={data.order}
                      onChange={(e) => setData('order', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.order && <p className="mt-1 text-sm text-red-600">{errors.order}</p>}
                  </div>

                  {/* Icon */}
                  <div>
                    <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                      Icon
                    </label>
                    <input
                      type="text"
                      id="icon"
                      value={data.icon || ''}
                      onChange={(e) => setData('icon', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., fa fa-folder"
                    />
                    {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon}</p>}
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={data.is_active}
                      onChange={(e) => setData('is_active', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                    {errors.is_active && <p className="mt-1 text-sm text-red-600">{errors.is_active}</p>}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href={route('admin.categories.index')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {processing ? 'Creating...' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
