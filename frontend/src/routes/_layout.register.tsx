import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'
import {getSession} from 'src/core/services/session.service.server'

export const action = async ({ request }: ActionFunctionArgs) => {
	const fd = await request.formData()

	const username = fd.get('username')
	const email = fd.get('email')
	const password = fd.get('password')

	if (!username || !email || !password) {
		return json({
			content: 'You must provide an username, email and a password'
		})
	}

    const response = await fetch("http://localhost:8000/api/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    })
    const data = await response.json()

    if(response.status !== 200) {
		return json({
			content: data
		})
    }

    return json({
        content: "Account successfully created, you can now login"
    })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'))

    if (session.has('jwt')) {
        return redirect('/')
    }

    return null
}

export default function Register () {
	const data = useActionData<typeof action>()

    return <div className="container mt-24 flex mx-auto gap-8 flex-col items-center">
		<h1 className='text-4xl'>Register</h1>
		{data?.content && <h2>{data.content}!</h2>}
		<div className='flex items-center flex-col z-20 w-5/6 xl:w-1/2 gap-12 xl:gap-8'>
			<Form className='flex w-full xl:w-1/2  items-center gap-8 z-20 flex-col' method='POST'>
				<input 
					autoComplete='off' name="username" type="text"
					className='bg-transparent w-full xl:w-4/5 border-2 border-gray-200 text-3xl xl:text-lg outline-none rounded-lg px-4 py-2'
					placeholder='username' />
				<input 
					autoComplete='off' name="email" type="text"
					className='bg-transparent w-full xl:w-4/5 border-2 border-gray-200 text-3xl xl:text-lg outline-none rounded-lg px-4 py-2'
					placeholder='email' />
				<input 
					autoComplete='off' name="password" type="password"
					className='bg-transparent w-full xl:w-4/5 border-2 border-gray-200 text-3xl xl:text-lg outline-none rounded-lg px-4 py-2'
					placeholder='password' />

				<button className='w-4/5 rounded-lg bg-slate-800 px-6 py-2 text-white hover:opacity-70 duration-300' ><span>Register</span></button>
			</Form>
			<hr className='w-full' />
			<span className='text-4xl xl:text-lg'>Already have an account? <Link to={'/login'} prefetch='intent' className='font-bold underline'>Login</Link> </span>
		</div>
	</div>
}
