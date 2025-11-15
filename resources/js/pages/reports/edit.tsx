import { Button } from '@/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/card';
import { Checkbox } from '@/components/checkbox';
import InputError from '@/components/input-error';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Select } from '@/components/select';
import AppLayout from '@/layouts/app-layout';
import { Device, FailureType, Maintenance } from '@/types/globals';
import { Head, useForm } from '@inertiajs/react';
import { Separator } from '@/components/separator';

type MaintenanceFormData = {
    device_id: number;
    cost: number;
    datetime: string;
    out_of_service_datetime: string;
    is_preventive: boolean;

    failure_type_id: number;
    failure_description: string;
    failure_cause: string;
};

export default function MaintenanceEdit({ maintenance, devices, failure_types }: { maintenance: Maintenance, devices: Device[], failure_types: FailureType[] }) {
    const { data, setData, put, errors } = useForm<MaintenanceFormData>({
        device_id: maintenance.device_id,
        cost: maintenance.cost,
        datetime: maintenance.datetime,
        out_of_service_datetime: maintenance.out_of_service_datetime,
        is_preventive: maintenance.is_preventive,

        failure_type_id: maintenance.failure?.failure_type_id || 0,
        failure_cause: maintenance.failure?.cause || '',
        failure_description: maintenance.failure?.description || ''
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('maintenances.update', maintenance.id));
    }

    return (
        <AppLayout>
            <Head title="Edit Maintenance" />
            <Card>
                <CardHeader>
                    <CardTitle>Edit Maintenance</CardTitle>
                    <CardDescription>
                        Update the details of the maintenance record.
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
                                    label: device.serial_number,
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
                            <InputError message={errors.datetime} />
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
                                        value={data.failure_type_id?.toString()}
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