import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
export default function Welcome() {
    return (
        <AuthLayout title="Islamc Click" description="Welcome to Islamc Click">

            <Button className="mt-4 w-full" onClick={() => window.location.href = '/login'}>

                Log in
            </Button>
        </AuthLayout>
    );
}
