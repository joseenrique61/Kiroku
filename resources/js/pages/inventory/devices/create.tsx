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
import { DeviceCategory, DeviceModel, DeviceStatus, Organization } from '@/types/globals';
import { Head, useForm } from '@inertiajs/react';

type DeviceFormData = {
    serial_number: string;
    description: string;
    device_category_id: number;
    device_model_id: number;
    device_status_id: number;
    price: number;
    acquired_at: string;
    warranty_end_date: string;
};

export default function DeviceCreate({ 
    deviceCategories: categories, 
    deviceModels: models, 
    deviceStatus: statuses, 
}: { 
    deviceCategories: DeviceCategory[], 
    deviceModels: DeviceModel[], 
    deviceStatus: DeviceStatus[], 
    organizations: Organization[] 
}) {
    const { data, setData, post, errors } = useForm<DeviceFormData>({
        serial_number: '',
        description: '',
        device_category_id: categories[0]?.id || 0,
        device_model_id: models[0]?.id || 0,
        device_status_id: statuses[0]?.id || 0,
        price: 0,
        acquired_at: '',
        warranty_end_date: '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('devices.store'));
    }

    return (
        <AppLayout>
            <Head title="Create Device" />
            <Card>
                <CardHeader>
                    <CardTitle>Create Device</CardTitle>
                    <CardDescription>
                        Create a new device to add to the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="device-create-page__form">
                        <div className="device-create-page__form-group">
                            <Label htmlFor="serial_number">Serial Number</Label>
                            <Input
                                id="serial_number"
                                name="serial_number"
                                value={data.serial_number}
                                onChange={(e) =>
                                    setData('serial_number', e.target.value)
                                }
                                placeholder="Enter device serial number"
                            />
                            <InputError message={errors.serial_number} />
                        </div>
                        <div className="device-create-page__form-group">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Enter device description"
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="device-create-page__form-group">
                            <Label htmlFor="device_category_id">Category</Label>
                            <Select
                                name="device_category_id"
                                value={data.device_category_id.toString()}
                                onValueChange={(value) =>
                                    setData('device_category_id', parseInt(value))
                                }
                                options={categories.map((category) => ({
                                    value: category.id.toString(),
                                    label: category.name,
                                }))}
                                placeholder="Select a category"
                            />
                            <InputError message={errors.device_category_id} />
                        </div>
                        <div className="device-create-page__form-group">
                            <Label htmlFor="device_model_id">Model</Label>
                            <Select
                                name="device_model_id"
                                value={data.device_model_id.toString()}
                                onValueChange={(value) =>
                                    setData('device_model_id', parseInt(value))
                                }
                                options={models.map((model) => ({
                                    value: model.id.toString(),
                                    label: `${model.device_brand.name} - ${model.name}`,
                                }))}
                                placeholder="Select a model"
                            />
                            <InputError message={errors.device_model_id} />
                        </div>
                        <div className="device-create-page__form-group">
                            <Label htmlFor="device_status_id">Status</Label>
                            <Select
                                name="device_status_id"
                                value={data.device_status_id.toString()}
                                onValueChange={(value) =>
                                    setData('device_status_id', parseInt(value))
                                }
                                options={statuses.map((status) => ({
                                    value: status.id.toString(),
                                    label: status.name,
                                }))}
                                placeholder="Select a status"
                            />
                            <InputError message={errors.device_status_id} />
                        </div>
                        <div className="device-create-page__form-group">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={data.price}
                                onChange={(e) =>
                                    setData('price', parseFloat(e.target.value))
                                }
                                placeholder="Enter price"
                            />
                            <InputError message={errors.price} />
                        </div>
                        <div className="device-create-page__form-group">
                            <Label htmlFor="acquired_at">Acquired At</Label>
                            <Input
                                id="acquired_at"
                                name="acquired_at"
                                type="date"
                                value={data.acquired_at}
                                onChange={(e) =>
                                    setData('acquired_at', e.target.value)
                                }
                            />
                            <InputError message={errors.acquired_at} />
                        </div>
                        <div className="device-create-page__form-group">
                            <Label htmlFor="warranty_end_date">Warranty End Date</Label>
                            <Input
                                id="warranty_end_date"
                                name="warranty_end_date"
                                type="date"
                                value={data.warranty_end_date}
                                onChange={(e) =>
                                    setData('warranty_end_date', e.target.value)
                                }
                            />
                            <InputError message={errors.warranty_end_date} />
                        </div>
                        <Button type="submit">Create</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
