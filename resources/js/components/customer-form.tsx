import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CustomerFormProps {
    onSuccess?: () => void;
    initialData?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        company?: string;
        job_title?: string;
        address?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
        notes?: string;
    };
}

export function CustomerForm({ onSuccess, initialData = {} }: CustomerFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        job_title: initialData.job_title || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        postal_code: initialData.postal_code || '',
        country: initialData.country || '',
        notes: initialData.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        axios.post('/api/customers', data, {
        }).then(response => {
            toast.success('Customer added successfully');
            reset();
            onSuccess?.();
        }).catch(error => {
            if (error.response?.data?.errors) {
                // Handle validation errors
                const errors = error.response.data.errors;
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key][0]);
                });
            } else {
                toast.error('Failed to add customer');
                console.error('Error adding customer:', error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                        id="first_name"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        required
                    />
                    {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                        id="last_name"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        required
                    />
                    {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                        id="company"
                        value={data.company}
                        onChange={(e) => setData('company', e.target.value)}
                    />
                    {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input
                        id="job_title"
                        value={data.job_title}
                        onChange={(e) => setData('job_title', e.target.value)}
                    />
                    {errors.job_title && <p className="text-sm text-red-500">{errors.job_title}</p>}
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                        />
                        {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                            id="state"
                            value={data.state}
                            onChange={(e) => setData('state', e.target.value)}
                        />
                        {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="postal_code">Postal Code</Label>
                        <Input
                            id="postal_code"
                            value={data.postal_code}
                            onChange={(e) => setData('postal_code', e.target.value)}
                        />
                        {errors.postal_code && <p className="text-sm text-red-500">{errors.postal_code}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                            id="country"
                            value={data.country}
                            onChange={(e) => setData('country', e.target.value)}
                        />
                        {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                        id="notes"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        rows={3}
                    />
                    {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : 'Save Customer'}
                </Button>
            </div>
        </form>
    );
}
