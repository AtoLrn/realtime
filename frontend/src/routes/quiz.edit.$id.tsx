import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import * as Dialog from '@radix-ui/react-dialog'
import {Form, Link, useActionData, useLoaderData} from '@remix-run/react'
import {getSession} from 'src/core/services/session.service.server'
import {useState} from 'react'
import {Question} from 'src/utils/types/question'
import {Answer} from 'src/utils/types/answer'
import { FaRegTrashAlt } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'))

    if (!session.has('jwt')) {
        return redirect('/')
    }

	const fd = await request.formData()
	const requestType = fd.get('request-type')

    if(requestType === 'question'){
        const content = fd.get('content')
        const response = await fetch(`${process.env.API_URL}/api/question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content,
                quizId: parseInt(params.id as string)
            })
        })
        const data = await response.json()

        if(response.status !== 200) {
            return json({
                error: data
            })
        }
    } else if (requestType === 'answer'){
        const content = fd.get('response')
        const response = await fetch(`${process.env.API_URL}/api/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content,
                isRight: fd.get('isGood') === 'on' ? true : false,
                questionId: parseInt(fd.get('questionId') as string)
            })
        })
        const data = await response.json()

        if(response.status !== 200) {
            return json({
                error: data
            })
        }
    } else {
	    return redirect(`/quiz/edit/${params.id}`)
    }

	return redirect(`/quiz/edit/${params.id}`)
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

    const [ isDialogQuestionOpen, setIsDialogQuestionOpen ] = useState(false)
    const [ isDialogAnswerOpen, setIsDialogAnswerOpen ] = useState(false)
    const [ selectedQuestion, setSelectedQuestion ] = useState("")

	return (
		<main className='flex flex-col min-h-screen min-w-full bg-slate-900 text-white gap-4'>
			<nav className="w-full mx-auto  py-4 bg-slate-800">
				<div className="mx-auto container flex items-center justify-start">
                    <Link to={"/"} className='text-white text-xl font-bold mr-4'>
                        <IoHomeOutline />
                    </Link>
					<h1 className="uppercase text-xl font-bold">
						{quiz.name}
					</h1>
				</div>
			</nav>
		    {data?.error && <h2>{data.error}!</h2>}
            <div className='container mx-auto gap-4 flex flex-col item-center'>
				<div className='flex flex-col gap-8 w-2/3'>
                    <h1 className='text-2xl'>
                        Questions :
                    </h1>
                    <hr className="mb-4 w-full opacity-30" />
                    <div>
                        <Dialog.Root open={isDialogQuestionOpen}>
                            <Dialog.Trigger asChild>
                                <button onClick={() => setIsDialogQuestionOpen(true)} className="outline-none px-4 py-2 bg-slate-600 rounded-md uppercase font-bold">Add question</button>
                            </Dialog.Trigger>
                            <Dialog.Portal>
                                <Dialog.Overlay className="top-0 left-0 absolute w-screen h-full bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
                                <Dialog.Content className="flex flex-col items-stretch justify-start gap-4 p-4 z-20 bg-zinc-600 bg-opacity-30 w-1/4 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
                                    <Form onSubmit={() => setIsDialogQuestionOpen(false)} method='POST' className='flex flex-col gap-2'>
                                        <input value="question" name="request-type" readOnly hidden />
                                        <div className='flex flex-col gap-2'>
                                            <h2 className='uppercase font-bold'>
                                                Create a Question
                                            </h2>
                                        </div>
                                        <hr className='pb-4' />
                                        <div className='pb-4 flex flex-col items-start gap-2'>
                                            <label htmlFor="content" className='uppercase font-bold'>Content :</label>
                                            <input required name="content" className='bg-transparent w-full xl:w-4/5 border-2 border-gray-200 text-3xl xl:text-lg outline-none rounded-lg px-4 py-2' id='content' />
                                        </div>
                                        <div className='flex gap-2 items-center justify-end w-full'>
                                            <Dialog.Close asChild>
                                                <button onClick={() => {
                                                    setIsDialogQuestionOpen(false)
                                                }} className="outline-none px-4 py-2 bg-slate-600 rounded-md uppercase font-bold">Cancel</button>
                                            </Dialog.Close>
                                            <button className="outline-none px-4 py-2 bg-slate-600 rounded-md uppercase font-bold">Create</button>
                                        </div>
                                    </Form>
                                </Dialog.Content>
                            </Dialog.Portal>
                        </Dialog.Root>
                    </div>
                </div>
				    <div className='w-full'>
                        {quiz.questions.map((question: Question, index: number) => {
                            return <div key={question.id} className='mb-4 px-8 py-4 flex flex-col w-full bg-slate-800 rounded-md'>
                                <h1 className='uppercase font-bold'>
                                    {index + 1} : {question.content}
                                </h1>
                                <hr className="my-4 w-full opacity-30" />
                                {!question.answers?.find((answer: Answer) => answer.isRight) ? 
                                    <p className='text-red-600 font-bold uppercase'>Without any good answer, this question won't appear in the quiz</p>
                                :
                                    null
                                }
                                {question.answers?.map((answer: Answer) => {
                                    return <div key={answer.id} className='mb-4 w-full bg-slate-600 flex justify-between items-center px-4 py-4 rounded-lg'>
                                        <h1 className='uppercase font-bold'>{answer.content}</h1>
                                        <div className='flex items-center'>
                                            {answer.isRight ?
                                                <p className='text-green-600 font-bold uppercase'>good answer</p>
                                            :
                                                <p className='text-red-600 font-bold uppercase'>wrong answer</p>
                                            }
                                            <Link to={`/quiz/edit/${quiz.id}/answer/${answer.id}/delete`} className='text-white ml-4 p-3 bg-red-900 rounded-lg'>
                                                <FaRegTrashAlt/>
                                            </Link>
                                        </div>
                                    </div>
                                })
                                }
                                <div className='flex'>
                                    <Dialog.Root open={isDialogAnswerOpen}>
                                        <Dialog.Trigger asChild>
                                            <div>
                                                <button onClick={() => {
                                                    setSelectedQuestion(question.id)
                                                    setIsDialogAnswerOpen(true)}} className="mr-4 outline-none px-4 py-2 bg-slate-600 rounded-md uppercase font-bold">Add response</button>
                                            </div>
                                        </Dialog.Trigger>
                                        <Dialog.Portal>
                                            <Dialog.Overlay className="top-0 left-0 absolute w-screen h-full bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
                                            <Dialog.Content className="flex flex-col items-stretch justify-start gap-4 p-4 z-20 bg-zinc-600 bg-opacity-30 w-1/4 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
                                                <Form onSubmit={() => setIsDialogAnswerOpen(false)} method='POST' className='flex flex-col gap-2'>
                                                    <input value="answer" name="request-type" readOnly hidden />
                                                    <input value={selectedQuestion} name="questionId" readOnly hidden />
                                                    <div className='flex flex-col gap-2'>
                                                        <h2 className='uppercase font-bold'>
                                                            add a response
                                                        </h2>
                                                    </div>
                                                    <hr className='pb-4' />
                                                    <div className='pb-4 flex flex-col items-start gap-2'>
                                                        <label htmlFor="response" className='uppercase font-bold'>Response :</label>
                                                        <input required name="response" className='bg-transparent w-full xl:w-4/5 border-2 border-gray-200 text-3xl xl:text-lg outline-none rounded-lg px-4 py-2' id='response' />
                                                    </div>
                                                    <div className='pb-4 flex items-start gap-2'>
                                                        <label htmlFor="isGood" className='uppercase font-bold'>Good response ? :</label>
                                                        <input type='checkbox' name="isGood" className='' id='isGood' />
                                                    </div>
                                                    <div className='flex gap-2 items-center justify-end w-full'>
                                                        <Dialog.Close asChild>
                                                            <button onClick={() => {
                                                                setIsDialogAnswerOpen(false)
                                                            }} className="outline-none px-4 py-2 bg-slate-600 rounded-md uppercase font-bold">Cancel</button>
                                                        </Dialog.Close>
                                                        <button className="outline-none px-4 py-2 bg-slate-600 rounded-md uppercase font-bold">Add</button>
                                                    </div>
                                                </Form>
                                            </Dialog.Content>
                                        </Dialog.Portal>
                                    </Dialog.Root>
                                    <Link to={`/quiz/edit/${quiz.id}/question/${question.id}/delete`} className='px-4 py-2 bg-red-900 rounded-md uppercase font-bold'>
                                        Delete question
                                    </Link>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            <style>
            {`
                input[type=checkbox] {
                    position: relative;
                    border: 2px solid white;
                    background: none;
                    outline: 0;
                    height: 20px;
                    width: 20px;
                    -webkit-appearance: none;
                }
                
                input[type=checkbox]:checked {
                    background-color: white;
                }
                
                input[type=checkbox]:checked:before {
                    content: '';
                    position: absolute;
                    right: 50%;
                    top: 50%;
                    width: 4px;
                    height: 10px;
                    border: solid #000;
                    border-width: 0 2px 2px 0;
                    margin: -1px 0 0 -1px;
                    transform: rotate(45deg) translate(-50%, -50%);
                    z-index: 2;
                }
            `}
            </style>
		</main>
	) 
} 
