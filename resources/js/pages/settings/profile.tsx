import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { type BreadcrumbItem } from '@/types';
import { type SharedData } from '@/types/globals';
import { Transition } from '@headlessui/react';
import { Form, Head, usePage, useForm } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile() {
    const { auth } = usePage<SharedData>().props;

    // For DeleteUser component
    const {
        setData: setDeleteForm,
        delete: destroy,
        reset: deleteReset,
    } = useForm({
        password: '',
    });

    const deleteUser = (password: string) => {
        setDeleteForm('password', password);
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => deleteReset(),
            onError: () => console.error('Error deleting user'),
        });
    };

    const cancelDelete = () => {
        deleteReset();
        // Close modal if one was open
        console.log('Delete cancelled');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="profile-settings">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="profile-settings__form"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="profile-settings__form-group">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError message={errors.name} />
                                </div>

                                <div className="profile-settings__form-group">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError message={errors.email} />
                                </div>

                                <div className="profile-settings__form-actions">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="profile-settings__saved-message">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser onDelete={deleteUser} onCancel={cancelDelete} />
            </SettingsLayout>
        </AppLayout>
    );
}