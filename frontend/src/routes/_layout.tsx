import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Link, NavLink, Outlet, Form, useLoaderData } from '@remix-run/react'
import { getSession, destroySession } from 'src/core/services/session.service.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'))

    if (session.has('jwt')) {
        return json({ isAuth: true })
    }

    return json({ isAuth: false })
}

export default function Layout () {
    const { isAuth } = useLoaderData<typeof loader>()

    return <main className='flex flex-col min-h-screen min-w-full bg-slate-900 text-white gap-4'>
        <nav className="w-full mx-auto  py-4 bg-slate-800">
            <div className="mx-auto container flex items-center justify-between">
                <h1 className="text-xl font-bold">
                    KaLoop
                </h1>
                {
                    isAuth ? <div className="flex justify-between">
                        <Link to={'/logout'} className='px-4 py-2 font-bold bg-slate-900 rounded-lg'>
                            Logout
                        </Link>
                    </div> : <div className="w-1/6 flex justify-between">
                        <Link to={'/login'} className='px-4 py-2 font-bold bg-slate-900 rounded-lg'>
                            Login
                        </Link>
                        <Link to={'/register'} className='px-4 py-2 font-bold bg-slate-900 rounded-lg'>
                            Register
                       </Link>
                    </div> 
                }
            </div>
        </nav>
		<Outlet />
    </main>
}
