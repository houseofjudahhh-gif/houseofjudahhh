import {getAdminUser} from '../lib/admin-auth';
import {redirect} from 'next/navigation';
import Admin from '../components/Admin';
export const dynamic='force-dynamic';
export const metadata={robots:{index:false,follow:false}};
export default async function AdminPage(){const user=await getAdminUser();if(!user)redirect('/admin/login');return <Admin name={user.displayName}/>;}
