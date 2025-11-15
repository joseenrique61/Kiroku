import { Button } from '@/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/card';
import { Checkbox } from '@/components/checkbox';
import { Input } from '@/components/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/label';
import { Select } from '@/components/select';
import { Separator } from '@/components/separator';
import AppLayout from '@/layouts/app-layout';
import { Device, FailureType } from '@/types/globals';
import { Head, useForm } from '@inertiajs/react';

type MaintenanceFormData = {
    device_id: number;
    cost: number;
    datetime?: string;
    out_of_service_datetime: string;
    is_preventive: boolean;

    failure_type_id: number;
    failure_description: string;
    failure_cause: string;
};

export default function MaintenanceCreate({
    devices,
    failure_types,
}: {
    devices: Device[];
    failure_types: FailureType[];
}) {
    const { data, setData, post, errors, setError } = useForm<MaintenanceFormData>({
        device_id: devices[0]?.id || 0,
        cost: 0,
        datetime: '',
        out_of_service_datetime: '',
        is_preventive: true,

        failure_type_id: failure_types[0]?.id || 1,
        failure_description: '',
        failure_cause: '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (data.datetime && data.out_of_service_datetime && new Date(data.out_of_service_datetime) > new Date(data.datetime)) {
            setError('datetime', 'The Rehabilitation date cannot be greater than the Out of service date');
            return;
        }
        post(route('maintenances.store'));
    }

    return (
        <AppLayout>
            <Head title="Create Maintenance" />
            <Card>
                <CardHeader>
                    <CardTitle>Create Maintenance</CardTitle>
                    <CardDescription>
                        Create a new maintenance record to add to the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className="maintenance-create-page__form"
                    >
                        <div className="maintenance-create-page__form-group">
                            <Label htmlFor="device_id">Device</Label>
                            <Select
                                name="device_id"
                                value={data.device_id.toString()}
                                onValueChange={(value) =>
                                    setData('device_id', parseInt(value))
                                }
                                options={devices.map((device) => ({
                                    value: device.id.toString(),
                                    label: `${device.device_model.name} - ${device.serial_number}`,
                                }))}
                                placeholder="Select a device"
                            />
                            <InputError message={errors.device_id} />
                        </div>
                        <div className="maintenance-create-page__form-group">
                            <Label htmlFor="cost">Maintenance Cost</Label>
                            <Input
                                id="cost"
                                name="cost"
                                type="number"
                                value={data.cost}
                                onChange={(e) =>
                                    setData('cost', parseFloat(e.target.value))
                                }
                                placeholder="Enter maintenance cost"
                            />
                            <InputError message={errors.cost} />
                        </div>
                        <div className="maintenance-create-page__form-group">
                            <Label htmlFor="out_of_service_datetime">
                                Out of Service Date
                            </Label>
                            <Input
                                id="out_of_service_datetime"
                                name="out_of_service_datetime"
                                type="date"
                                value={data.out_of_service_datetime}
                                onChange={(e) =>
                                    setData(
                                        'out_of_service_datetime',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={errors.out_of_service_datetime} />
                        </div>
                        <div className="maintenance-create-page__form-group">
                            <Label htmlFor="datetime">
                                Rehabilitation Date
                            </Label>
                            <Input
                                id="datetime"
                                name="datetime"
                                type="date"
                                value={data.datetime}
                                onChange={(e) =>
                                    setData('datetime', e.target.value)
                                }
                            />
                            <InputError message={errors.datetime} />
                        </div>
                        <div className="maintenance-create-page__form-group--row">
                            <Label htmlFor="is_preventive">
                                Is Preventive?
                            </Label>
                            <Checkbox
                                id="is_preventive"
                                name="is_preventive"
                                checked={data.is_preventive}
                                onCheckedChange={(checked) =>
                                    setData('is_preventive', checked as boolean)
                                }
                            />
                            <InputError message={errors.is_preventive} />
                        </div>
                        {!data.is_preventive && (
                            <>
                                <Separator />
                                <div className="maintenance-create-page__form-group">
                                    <Label htmlFor="failure_type_id">
                                        Failure Type
                                    </Label>
                                    <Select
                                        name="failure_type_id"
                                        value={data.failure_type_id.toString()}
                                        onValueChange={(value) =>
                                            setData(
                                                'failure_type_id',
                                                parseInt(value),
                                            )
                                        }
                                        options={failure_types.map(
                                            (failure_type) => ({
                                                value: failure_type.id.toString(),
                                                label: failure_type.name,
                                            }),
                                        )}
                                        placeholder="Select a failure type"
                                    />
                                    <InputError
                                        message={errors.failure_type_id}
                                    />
                                </div>
                                <div className="maintenance-create-page__form-group">
                                    <Label htmlFor="failure_description">Description</Label>
                                    <Input
                                        id="failure_description"
                                        name="failure_description"
                                        type="text"
                                        value={data.failure_description}
                                        onChange={(e) =>
                                            setData(
                                                'failure_description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter description"
                                    />
                                    <InputError message={errors.failure_description} />
                                </div>
                                <div className="maintenance-create-page__form-group">
                                    <Label htmlFor="failure_cause">Cause</Label>
                                    <Input
                                        id="failure_cause"
                                        name="failure_cause"
                                        type="text"
                                        value={data.failure_cause}
                                        onChange={(e) =>
                                            setData(
                                                'failure_cause',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter cause"
                                    />
                                    <InputError message={errors.failure_cause} />
                                </div>
                            </>
                        )}
                        <Button type="submit">Create</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
