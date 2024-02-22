import * as Dialog from '@radix-ui/react-dialog'
import {ActionFunctionArgs, LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import {useState} from 'react'
import {getSession} from 'src/core/services/session.service.server'
import {Quiz} from 'src/utils/types/quiz'
import { jwtDecode } from "jwt-decode";
import {User} from 'src/utils/types/user'

export const action = async ({ request }: ActionFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'))

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'))

    let user = {} as User

    if (session.has('jwt')) {
        const jwt = session.get('jwt') as string
        user = jwtDecode(jwt) as User
    }

    const response = await fetch(`${process.env.API_URL}/api/quiz`)
    const data = await response.json()

    if(response.status !== 200) {
        return json({
            quiz: [],
            user
        })
    }

	return json({
		quiz: data,
        user
	})
}

export default function MainPage() { 
	const data = useActionData<typeof action>()
    const { quiz, user } = useLoaderData<typeof loader>()

    const [ isDialogOpen, setIsDialogOpen ] = useState(false)

	return (
        <div className="container flex mx-auto gap-4">
		    {data?.error && <h2>{data.error}!</h2>}
            <div className="flex-1 flex flex-col items-start gap-4">
                <h1 className="text-2xl">
                    Rooms
                </h1>
                <hr className="w-full opacity-30" />
                <div className="flex flex-col items-start gap-3 w-full">
                    { quiz.map((quiz: Quiz) => {
                        return <div key={quiz.id} className='w-full'>
                            <div className='w-full bg-slate-800 flex justify-between gap-4 px-4 py-4 rounded-lg cursor-pointer'>
                                <h1 className='uppercase font-bold'>{quiz.name}</h1>
                                <div>
                                    <Link to={`/quiz/${quiz.id}`} className='uppercase px-4 py-2 font-bold bg-slate-600 rounded-lg'>Join</Link>
                                    {user.isAdmin ?
                                        <Link to={`/quiz/edit/${quiz.id}`} className='ml-4 uppercase px-4 py-2 font-bold bg-slate-600 rounded-lg'>Edit</Link>
                                    : null}
                                </div>
                            </div>
                        </div>
                    }) }
                </div>

            </div>
            {user.isAdmin ?
                <div className="flex-1 flex flex-col items-start gap-4">
                    <h1 className="text-2xl">
                        Organise a test
                    </h1>
                    <hr className="w-full opacity-30" />
                    <Dialog.Root open={isDialogOpen}>
                        <Dialog.Trigger asChild>
                            <button onClick={() => setIsDialogOpen(true)} className="bg-slate-800 cursor-pointer rounded-lg px-4 py-2 uppercase font-bold">
                                Create a quiz
                            </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
                            <Dialog.Content className="flex flex-col items-stretch justify-start gap-4 p-4 z-20 bg-zinc-600 bg-opacity-30 w-1/4 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
                                <Form onSubmit={() => setIsDialogOpen(false)} method='POST' className='flex flex-col gap-2'>
                                    <div className='flex flex-col gap-2'>
                                        <h2 className='uppercase font-bold'>
                                            Create a Quiz
                                        </h2>
                                    </div>
                                    <hr className='pb-4' />
                                    <div className='pb-4 flex flex-col items-start gap-2'>
                                        <label htmlFor="name" className='uppercase font-bold'>Name :</label>
                                        <input required name="name" className='resize-y my-4 bg-transparent border-1 border-white w-full' id='name' />
                                    </div>
                                    <div className='flex gap-2 items-center justify-end w-full'>
                                        <Dialog.Close asChild>
                                            <button onClick={() => {
                                                setIsDialogOpen(false)
                                            }} className="outline-none px-4 py-2 bg-slate-600 rounded-md uppercase font-bold">Cancel</button>
                                        </Dialog.Close>
                                        <button className="outline-none px-4 py-2 bg-slate-600 rounded-md uppercase font-bold">Create</button>
                                    </div>
                                </Form>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                </div>
            : null}
        </div>
	)
}

