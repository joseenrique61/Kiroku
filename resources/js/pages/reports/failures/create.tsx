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
import { FailureType, Maintenance } from '@/types/globals';
import { Head, useForm } from '@inertiajs/react';

type FailureFormData = {
    description: string;
    cause: string;
    maintenance_id: number;
    failure_type_id: number;
};

export default function FailureCreate({ 
    maintenances, 
    failureTypes 
}: { 
    maintenances: Maintenance[], 
    failureTypes: FailureType[] 
}) {
    const { data, setData, post, errors } = useForm<FailureFormData>({
        description: '',
        cause: '',
        maintenance_id: maintenances[0]?.id || 0,
        failure_type_id: failureTypes[0]?.id || 0,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('failures.store'));
    }

    return (
        <AppLayout>
            <Head title="Create Failure" />
            <Card>
                <CardHeader>
                    <CardTitle>Create Failure</CardTitle>
                    <CardDescription>
                        Create a new failure to add to the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="failure-create-page__form">
                        <div className="failure-create-page__form-group">
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
                        <div className="failure-create-page__form-group">
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
                        <div className="failure-create-page__form-group">
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
                        <div className="failure-create-page__form-group">
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
                        <Button type="submit">Create</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}