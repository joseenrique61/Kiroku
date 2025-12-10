import { Button } from '@/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/card';
import InputError from '@/components/input-error';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Organization } from '@/types/globals';
type OrganizationFormData = {
    name: string;
};

export default function OrganizationEdit({ organization }: { organization: Organization }) {
    const { data, setData, put, errors } = useForm<OrganizationFormData>({
        name: organization.name,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('organizations.update', organization.id));
    }

    return (
        <AppLayout>
            <Head title="Edit Organization" />
            <Card>
                <CardHeader>
                    <CardTitle>Edit Organization</CardTitle>
                    <CardDescription>
                        Update the details of the organization.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="organization-index-page__actions">
                        <Button asChild>
                            <Link href={route('organizations.index')}>
                                Go Back
                            </Link>
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit} className="organization-edit-page__form">
                        <div className="organization-edit-page__form-group">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Enter organization name"
                            />
                            <InputError message={errors.name} />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}