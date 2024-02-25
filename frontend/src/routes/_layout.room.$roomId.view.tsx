import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export const loader = async ({ params }: LoaderFunctionArgs) => {

	try {
		const response = await fetch(`${process.env.API_URL}/api/room/${params.roomId}`, {
			method: 'GET',
		})
	
		const room = await response.json()

		const roomAnswerResponse = await fetch(`${process.env.API_URL}/api/room/${params.roomId}/answer`, {
			method: 'GET',
		})
	
		const roomAnswer = await roomAnswerResponse.json()
	
		return json({
			room,
			roomAnswer,
			socketUrl: process.env.SOCKET_URL!,
			roomId: params.roomId
		})
	} catch {
		return redirect('/')
	}
}

export default function Layout () {
	const { roomId, socketUrl, room, roomAnswer } = useLoaderData<typeof loader>()
	const [ answers, setAnswers ] = useState<Array<any>>([...roomAnswer])

	useEffect(() => {
		const socket = io(socketUrl)

		socket.on('answer', ( answer: any) => {
			setAnswers((current) => [...current, answer])
		})

		socket.emit('watchRoom', { roomId })
	}, [])

	const sortedAnswers = answers.reduce((acc, val) => {
		(acc[val.userId] = acc[val.userId] || []).push(val)
		return acc
	}, {})
	
	return <div className="container mt-24 flex mx-auto gap-8 flex-col items-center">
		<main className='flex flex-col min-h-screen min-w-full bg-slate-900 text-white gap-4'>
			<span className='w-full mx-auto  p-4 bg-slate-800 text-xl font-bold'>
				{ room.quiz.name }
			</span>
			<table className='w-full'>
				<thead><tr className='w-full flex'>
					<th className='flex-1'>
					UserId
					</th>
					{ room.quiz.questions.map((question: any) => {
						return <th className='flex-1' key={question.id}>
							{ question.content }
						</th>
					}) }
				</tr></thead>
				<tbody>
					{ Object.entries(sortedAnswers).map(([ userId, answers ]) => {
						console.log(answers)
						return <tr className='flex w-full' key={userId}>
							<td className='flex-1 text-center'>
								{ userId }
							</td>
							{
								room.quiz.questions.map((quizQuestion) => {
									const answer = answers.find(({ question }) => question.id === quizQuestion.id)

									console.log(answer)

									return <td className={`flex-1 text-center ${answer?.answer.isRight ? 'text-green-400' : 'text-red-400'}`}>
										{ answer?.answer.content }
									</td>
								})
							}
							{/* { (answers as any).map((roomAnswer: any) => {
								return <td key={roomAnswer.answer.id} className='flex-1 text-center'>
									{ roomAnswer.answer.content }
								</td>
							}) } */}
						</tr>
					})}
					
				</tbody>
			</table>
		</main>
	
	</div>
}
