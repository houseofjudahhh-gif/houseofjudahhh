import {getAdminUser} from '../../lib/admin-auth';
import {redirect} from 'next/navigation';
import Logo from '../../components/Logo';
import AdminLogin from '../../components/AdminLogin';
export const dynamic='force-dynamic';
export const metadata={robots:{index:false,follow:false}};
export default async function Login(){if(await getAdminUser())redirect('/admin');return <main className="access-page admin-login"><a href="/" aria-label="House of Judah home"><Logo/></a><p className="eyebrow">Private band dashboard</p><h1>Admin login</h1><p>Sign in to manage events, photos, posters, and worship recordings.</p><AdminLogin/><a className="text-button" href="/">Back to website</a></main>;}
