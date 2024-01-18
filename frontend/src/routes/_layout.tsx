import { LoaderFunctionArgs, json } from '@remix-run/node'
import * as Popover from '@radix-ui/react-popover'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { getSession } from 'src/core/services/session.service.server'
import { CiUser } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";

interface jwtPayload {
    id: number
    username: string
    email: string
    isAdmin: boolean
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'))

    if (session.has('jwt')) {
        const jwt = session.get('jwt') as string
        const decoded = jwtDecode(jwt) as jwtPayload

        return json({ 
            isAuth: true, 
            username: decoded.username
        })
    }

    return json({ 
        isAuth: false,
        username: null
    })
}

export default function Layout () {
    const { isAuth, username } = useLoaderData<typeof loader>()

    return <main className='flex flex-col min-h-screen min-w-full bg-slate-900 text-white gap-4'>
        <nav className="w-full mx-auto  py-4 bg-slate-800">
            <div className="mx-auto container flex items-center justify-between">
                <h1 className="text-xl font-bold">
                    KaLoop
                </h1>
                {
                    isAuth ? <div className="w-1/6 flex justify-between">
                          <Popover.Root>
                            <Popover.Trigger asChild>
                                <div className='px-2 py-2 rounded-full bg-slate-600 shadow cursor-pointer flex flex-col items-center justify-center'>
                                    <CiUser size={24} />
                                </div>
                            </Popover.Trigger>
                            <Popover.Portal>
                              <Popover.Content>
                                <div className='border border-gray-800 mt-4 px-4 py-2 rounded-md shadow bg-slate-600'>
                                    <p className='text-white'>{ username }</p>
                                </div>
                              </Popover.Content>
                            </Popover.Portal>
                          </Popover.Root>
                        <Link to={'/logout'} className='px-4 py-2 font-bold bg-slate-600 rounded-lg'>
                            Logout
                        </Link>
                    </div> : <div className="w-1/6 flex justify-between">
                        <Link to={'/login'} className='px-4 py-2 font-bold bg-slate-600 rounded-lg'>
                            Login
                        </Link>
                        <Link to={'/register'} className='px-4 py-2 font-bold bg-slate-600 rounded-lg'>
                            Register
                       </Link>
                    </div> 
                }
            </div>
        </nav>
		<Outlet />
    </main>
}
