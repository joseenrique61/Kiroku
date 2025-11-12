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
import { Device } from '@/types/globals';
import { Head, useForm } from '@inertiajs/react';
import { Checkbox } from '@/components/checkbox';

type MaintenanceFormData = {
    device_id: number;
    cost: number;
    datetime: string;
    is_preventive: boolean;
};

export default function MaintenanceCreate({ devices }: { devices: Device[] }) {
    const { data, setData, post, errors } = useForm<MaintenanceFormData>({
        device_id: devices[0]?.id || 0,
        cost: 0,
        datetime: '',
        is_preventive: false,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
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
                    <form onSubmit={handleSubmit} className="maintenance-create-page__form">
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
                        <div className="maintenance-create-page__form-group">
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
                        <div className="maintenance-create-page__form-group--row">
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
                        <Button type="submit">Create</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
