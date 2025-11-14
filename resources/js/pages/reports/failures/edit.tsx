import { Button } from '@/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/card';
import { Input } from '@/components/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/label';
import AppLayout from '@/layouts/app-layout';
import { FailureType } from '@/types/globals';
import { Head, useForm } from '@inertiajs/react';

type FailureTypeFormData = {
    name: string;
    severity: string;
};

export default function FailureEdit({
    failureType,
}: {
    failureType: FailureType;
}) {
    const { data, setData, put, errors } = useForm<FailureTypeFormData>({
        name: failureType.name,
        severity: failureType.severity,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('failureTypes.update', failureType.id));
    }

    return (
        <AppLayout>
            <Head title="Edit Failure Type" />
            <Card>
                <CardHeader>
                    <CardTitle>Edit Failure Type</CardTitle>
                    <CardDescription>
                        Update the details of the failure type.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className="failure-edit-page__form"
                    >
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
                            <Label htmlFor="severity">Cause</Label>
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
                        <Button type="submit">Update</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
