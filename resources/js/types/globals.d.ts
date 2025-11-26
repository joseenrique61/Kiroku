import { route as routeFn } from 'ziggy-js';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { User } from './user';

declare global {
    let route: typeof routeFn;

    interface PageProps extends InertiaPageProps, SharedData {
        // No need to redefine auth here, it comes from SharedData
    }
}

export interface SharedData {
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export interface Device {
    id: number;
    serial_number: string;
    description: string;
    device_category_id: number;
    device_model_id: number;
    device_status_id: number;
    organization_id: number;
    device_category: DeviceCategory;
    device_model: DeviceModel;
    device_status: DeviceStatus;
    organization: Organization;
    acquisition: Acquisition;
}

export interface DeviceCategory {
    id: number;
    name: string;
}

export interface DeviceBrand {
    id: number;
    name: string;
}

export interface DeviceModel {
    id: number;
    name: string;
    device_brand: DeviceBrand;
}

export interface DeviceStatus {
    id: number;
    name: string;
}

export interface Organization {
    id: number;
    name: string;
}

export interface Acquisition {
    id: number;
    price: number;
    acquired_at: string;
    warranty_end_date: string;
}

export interface Failure {
    id: number;
    description: string;
    cause: string;
    maintenance_id: number;
    failure_type_id: number;
    failure_type: FailureType;
}

export interface FailureType {
    id: number;
    name: string;
    severity: string;
}

export interface Maintenance {
    id: number;
    device_id: number;
    cost: number;
    back_to_service_datetime: string;
    out_of_service_datetime: string;
    is_preventive: boolean;
    device: Device;
    failure?: Failure;
}

export interface AuditLog {
    id: number;
    table_name: string;
    record_primary_key: number;
    operation: string;
    value_before: string;
    value_after: string;
    host_ip: string;
    user_id: number;
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}
