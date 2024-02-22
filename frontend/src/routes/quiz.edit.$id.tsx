import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import {useActionData, useLoaderData} from '@remix-run/react'
import {getSession} from 'src/core/services/session.service.server'

export const action = async ({ request }: ActionFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'))

    if (!session.has('jwt')) {
        return redirect('/')
    }

	const fd = await request.formData()

	const name = fd.get('name')

    const response = await fetch(`${process.env.API_URL}/api/quiz`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name
        })
    })
    const data = await response.json()

    if(response.status !== 200) {
        return json({
            error: data
        })
    }

	return redirect('/')
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'))
    const { id } = params

    const response = await fetch(`${process.env.API_URL}/api/quiz/${id}`)
    const data = await response.json()

    if(response.status !== 200) {
        return json({
            quiz: null,
        })
    }

	return json({
		quiz: data,
	})
}

export default function Page () {
	const data = useActionData<typeof action>()
    const { quiz } = useLoaderData<typeof loader>()

	return (
		<main className='flex flex-col min-h-screen min-w-full bg-slate-900 text-white gap-4'>
			<nav className="w-full mx-auto  py-4 bg-slate-800">
				<div className="mx-auto container flex items-center justify-start">
					<h1 className="text-xl font-bold">
						{quiz.name}
					</h1>
				</div>
			</nav>
		    {data?.error && <h2>{data.error}!</h2>}
		</main>
	) 
} 
