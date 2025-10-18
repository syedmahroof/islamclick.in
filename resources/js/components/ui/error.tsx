import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";

interface ErrorProps {
    message: string;
}

export function Error({ message }: ErrorProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-red-600 mb-4">{message}</p>
                <Link href="/dashboard">
                    <Button>Back to Dashboard</Button>
                </Link>
            </CardContent>
        </Card>
    );
}
