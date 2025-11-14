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
import { Select } from '@/components/select';
import AppLayout from '@/layouts/app-layout';
import { Failure, FailureType, Maintenance } from '@/types/globals';
import { Head, useForm } from '@inertiajs/react';

type FailureFormData = {
    description: string;
    cause: string;
    maintenance_id: number;
    failure_type_id: number;
};

export default function FailureEdit({ 
    failure,
    maintenances, 
    failureTypes 
}: { 
    failure: Failure,
    maintenances: Maintenance[], 
    failureTypes: FailureType[] 
}) {
    const { data, setData, put, errors } = useForm<FailureFormData>({
        description: failure.description,
        cause: failure.cause,
        maintenance_id: failure.maintenance_id,
        failure_type_id: failure.failure_type_id,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('failures.update', failure.id));
    }

    return (
        <AppLayout>
            <Head title="Edit Failure" />
            <Card>
                <CardHeader>
                    <CardTitle>Edit Failure</CardTitle>
                    <CardDescription>
                        Update the details of the failure.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="failure-edit-page__form">
                        <div className="failure-edit-page__form-group">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Enter failure description"
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="failure-edit-page__form-group">
                            <Label htmlFor="cause">Cause</Label>
                            <Input
                                id="cause"
                                name="cause"
                                value={data.cause}
                                onChange={(e) =>
                                    setData('cause', e.target.value)
                                }
                                placeholder="Enter failure cause"
                            />
                            <InputError message={errors.cause} />
                        </div>
                        <div className="failure-edit-page__form-group">
                            <Label htmlFor="maintenance_id">Maintenance</Label>
                            <Select
                                name="maintenance_id"
                                value={data.maintenance_id.toString()}
                                onValueChange={(value) =>
                                    setData('maintenance_id', parseInt(value))
                                }
                                options={maintenances.map((maintenance) => ({
                                    value: maintenance.id.toString(),
                                    label: 'Maintenance ID: ' + maintenance.id,
                                }))}
                                placeholder="Select a maintenance"
                            />
                            <InputError message={errors.maintenance_id} />
                        </div>
                        <div className="failure-edit-page__form-group">
                            <Label htmlFor="failure_type_id">Failure Type</Label>
                            <Select
                                name="failure_type_id"
                                value={data.failure_type_id.toString()}
                                onValueChange={(value) =>
                                    setData('failure_type_id', parseInt(value))
                                }
                                options={failureTypes.map((type) => ({
                                    value: type.id.toString(),
                                    label: type.name,
                                }))}
                                placeholder="Select a failure type"
                            />
                            <InputError message={errors.failure_type_id} />
                        </div>
                        <Button type="submit">Update</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
