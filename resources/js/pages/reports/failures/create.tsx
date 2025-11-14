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
import { Head, useForm } from '@inertiajs/react';

type FailureTypeFormData = {
    name: string;
    severity: string;
};

export default function FailureCreate() {
    const { data, setData, post, errors } = useForm<FailureTypeFormData>({
        name: '',
        severity: '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('failures.store'));
    }

    return (
        <AppLayout>
            <Head title="Create Failure Type" />
            <Card>
                <CardHeader>
                    <CardTitle>Create Failure Type</CardTitle>
                    <CardDescription>
                        Create a new failure type to add to the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="failure-create-page__form">
                        <div className="failure-create-page__form-group">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Enter name of failure type"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="failure-create-page__form-group">
                            <Label htmlFor="severity">Severity</Label>
                            <Input
                                id="severity"
                                name="severity"
                                value={data.severity}
                                onChange={(e) =>
                                    setData('severity', e.target.value)
                                }
                                placeholder="Enter severity of failure type"
                            />
                            <InputError message={errors.severity} />
                        </div>
                        <Button type="submit">Create</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}