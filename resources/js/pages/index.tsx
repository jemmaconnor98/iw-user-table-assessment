import UserTable from '@/components/ui/user-table';
import { usePage } from '@inertiajs/react';

export default function Index() {
    const { props } = usePage();
    const userData = props.userData;

    return (
        <div className={`flex items-center justify-center py-36`}>
            <UserTable initialData={userData} />
        </div>
    );
}
