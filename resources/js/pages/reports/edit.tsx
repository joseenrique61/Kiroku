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
import { Device, Maintenance } from '@/types/globals';
import { Head, useForm } from '@inertiajs/react';

type MaintenanceFormData = {
    device_id: number;
    cost: number;
    datetime: string;
    is_preventive: boolean;
};

export default function MaintenanceEdit({ maintenance, devices }: { maintenance: Maintenance, devices: Device[] }) {
    const { data, setData, put, errors } = useForm<MaintenanceFormData>({
        device_id: maintenance.device_id,
        cost: maintenance.cost,
        datetime: maintenance.datetime,
        is_preventive: maintenance.is_preventive,
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
                    <form onSubmit={handleSubmit} className="maintenance-edit-page__form">
                        <div className="maintenance-edit-page__form-group">
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
                        <div className="maintenance-edit-page__form-group">
                            <Label htmlFor="cost">Cost</Label>
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
                        <div className="maintenance-edit-page__form-group">
                            <Label htmlFor="datetime">Date</Label>
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
                        <div className="maintenance-edit-page__form-group--row">
                            <Label htmlFor="is_preventive">Is Preventive?</Label>
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
                        <Button type="submit">Update</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}