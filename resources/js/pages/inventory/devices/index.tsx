import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Device } from '@/types/globals'; // Asumo que tu tipo está aquí
import { Head, Link } from '@inertiajs/react';

// Tip: Define tus props en una interfaz para mejor claridad
interface DeviceIndexProps {
    devices: Device[];
}

export default function DeviceIndex({ devices }: DeviceIndexProps) {
    return (
        <AppLayout>
            <Head title="Devices" />

            {/* Reemplazo del Card */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                {/* Reemplazo del CardHeader */}
                <div className="p-6 border-b">
                    {/* Reemplazo del CardTitle */}
                    <h2 className="text-2xl font-semibold">Devices</h2>
                    {/* Reemplazo del CardDescription */}
                    <p className="text-gray-600 mt-1">
                        A list of all the devices in the system.
                    </p>
                </div>

                {/* Reemplazo del CardContent */}
                <div className="p-6">
                    {/* Reemplazo del div de acciones */}
                    <div className="mb-4">
                        <Link
                            href={route('devices.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Create Device
                        </Link>
                    </div>

                    {/* Reemplazo de la Table (usamos una tabla HTML real) */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Serial Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Model
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Organization
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {devices.map((device) => (
                                    <tr key={device.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {device.serial_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {device.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {device.device_category.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {device.device_model.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {device.device_status.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {device.organization.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {/* Reemplazo de Botones de Acción */}
                                            <Link
                                                href={route(
                                                    'devices.show',
                                                    device.id,
                                                )}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={route(
                                                    'devices.edit',
                                                    device.id,
                                                )}
                                                className="text-yellow-600 hover:text-yellow-900"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                href={route(
                                                    'devices.destroy',
                                                    device.id,
                                                )}
                                                method="delete"
                                                as="button"
                                                type="button"
                                                className="text-red-600 hover:text-red-900"
                                                onBefore={() =>
                                                    confirm(
                                                        'Are you sure you want to delete this device?',
                                                    )
                                                }
                                            >
                                                Delete
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}