import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { FaBook, FaRegCalendar } from 'react-icons/fa'
import { io } from 'socket.io-client'
import { Chat } from 'src/components/Chat'

interface State {
	isAllowed?: boolean,
	isConnected: boolean,
	isStarted: boolean
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
	const fd = await request.formData()

	const roomId = params.roomId
	const answerId = fd.get('answerId')?.toString() ?? ''
	const questionId = fd.get('questionId')?.toString() ?? ''
	const userId = fd.get('userId')

	const response = await fetch(`${process.env.API_URL}/api/room/${roomId}/answer`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			answerId: parseInt(answerId),
			questionId: parseInt(questionId),
			userId
		})
	})
	const data = await response.json()

	return json({})
}

export const loader = async ({ params }: LoaderFunctionArgs) => {

	try {
		const response = await fetch(`${process.env.API_URL}/api/room/${params.roomId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
	
		const room = await response.json()
	
		return json({
			room,
			socketUrl: process.env.SOCKET_URL!,
			roomId: params.roomId
		})
	} catch {
		return redirect('/')
	}
}

export default function Layout () {
	const { roomId, socketUrl, room } = useLoaderData<typeof loader>()

	const [ state, setState ] = useState<State>({
		isAllowed: undefined,
		isConnected: false,
		isStarted: room.status === 'RUNNING'
	})

	const [ questions, setQuestions ] = useState<unknown[]>([])
	const [ currentQuestion, setCurrentquestion ] = useState<unknown>()
	const [ isFinished, setIsFinished ] = useState(room.status === 'STOPPED')
	const [ userId, setUserId ] = useState<string>()
	const [ hasAnswered, setHasAnswered ] = useState(false)

	useEffect(() => {
		const socket = io(socketUrl)

		socket.on('joined', ({ joined, userId }) => {
			setUserId(userId)
			setState({
				isAllowed: joined,
				isConnected: joined,
				isStarted: room.status === 'RUNNING'
			})
		})

		socket.on('start', () => {
			setState({
				isAllowed: true,
				isConnected: true,
				isStarted: true
			})
		})

		socket.on('end', () => {
			setIsFinished(true || room.status === 'STOPPED')
		})

		socket.on('question', (data: unknown) => {
			setCurrentquestion(data)
			setHasAnswered(false)
			setQuestions((current) => [...current, data])
		})

		socket.emit('joinRoom', { roomId })
	}, [])
	
	return <div className="container mt-24 flex mx-auto gap-8 flex-col items-center">
		{ isFinished ? <nav className="w-full mx-auto  py-4 bg-slate-800">
			<div className="mx-auto container flex items-center justify-between">
				<h1 className="text-xl font-bold px-4">
					The test is finished
				</h1> 
			</div>
		</nav> : 

			<main className='flex flex-col min-h-screen min-w-full bg-slate-900 text-white gap-4'>
				{ !state.isStarted && <nav className="w-full mx-auto  py-4 bg-slate-800">
					<div className="mx-auto container flex items-center justify-between">
						<h1 className="text-xl font-bold px-4">
			Waiting for test to start...
						</h1> 
					</div>
				</nav> }
				<div className="container flex items-start mx-auto gap-4">
					<div className='px-8 py-4 flex flex-col gap-8 w-1/4 bg-slate-800 rounded-md'>
						<h1 className='font-bold'>
			Quiz
						</h1>
						<div className='flex gap-4 px-2 items-center'>
							<div className='h-12 w-12 rounded-lg flex items-center justify-center bg-slate-600'>
								<FaBook size={16} />
							</div>
							<h2 className='flex-1'>
								{ room.quiz.name }
							</h2>
						</div>
						<div className='flex flex-col gap-4'>
							<h1 className='font-bold'>
			Questions
							</h1>
							{ questions.map((question, index) => {
								return <div className='flex gap-4 px-2 items-center' key={question.id}>
									<div className={'h-12 w-12 rounded-lg flex items-center justify-center bg-slate-600 border border-white '}>
										<FaRegCalendar size={16} />								
									</div>
									<h2 className='flex-1'>
										<b>{index + 1}.</b> { question.content }
									</h2>
								</div>
		
							}) }
						</div>
		
					</div>
					<div className="relative flex flex-col items-center gap-4 w-2/4 px-8 py-4 bg-slate-800 rounded-md pt-44 mt-32">
						{ (currentQuestion as any) && <>
							{(currentQuestion as any).content.length % 2 === 0 
								?  <img className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3' src="/img/question.png" alt="" />
								: 						<img className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3' src="/img/nerd.png" alt="" />
							}
							<div className='w-full flex text-2xl gap-4'>
								<h2 className='font-bold'>
									{(currentQuestion as any).content}
								</h2>
							</div>
							{ hasAnswered && <span className='w-full mx-auto  py-4 bg-slate-800'>You have answered to the question</span> }

							{ !hasAnswered && <div className='grid grid-cols-1 gap-4 w-full'>
								{ (currentQuestion as any).answers?.map((answer) => {
									return <Form onSubmit={() => setHasAnswered(true)} method='POST' key={ answer.content }>
										<input type="hidden" name="answerId" value={answer.id} />
										<input type="hidden" name="questionId" value={(currentQuestion as any).id} />
										<input type="hidden" name="userId" value={userId} />
										<button  className={'bg-slate-600 border border-slate-600 rounded-lg px-4 py-2 cursor-pointer'}>{ answer.content }</button>
									</Form>
								})}
							</div>
							}
							
						</>}
		
					</div>
				</div>
				<Chat room={room} />
			</main>
		}
	
	</div>
}
