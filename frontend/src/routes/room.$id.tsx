import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Question } from 'src/utils/types/question'
import { Room } from 'src/utils/types/room'

export const loader = () => {
	const room: Room = {
		id: 'abcd2',
		name: 'The big final Exam',
		maxPeope: 20,
		currentPeople: 18
	}
	return json({
		room
	})
}

export default function Page () {
	const [ isWaiting, setWaiting ] = useState(true)
	const [ questions, setQuestions ] = useState<Question[]>([{
		id: 'ouga-1',
		title: 'What is the name of Nairi?',
		answers: ['Amin', 'Sebastien', 'Emmanuel', 'Samuel', 'Do Flamingo'],
		selectedOne: 'Amin'
	},
	{
		id: 'ouga-2',
		title: 'What is the name of OUga?',
		answers: ['Amin', 'Bouga', 'Emmanuel']
	}] )
	const [ selectedId, setSelectedId ] = useState<Question['id']>()
	const { room } = useLoaderData<typeof loader>()

	const question = questions.find((candidate) => candidate.id === selectedId)

	useEffect(() => {
		setTimeout(() => {
			setWaiting(false)
		}, 5000)
	}, [])

	if (isWaiting) {
		return <main className='flex flex-col justify-center items-center min-h-screen min-w-full bg-slate-900 text-white gap-4'>
			<h1 className='font-bold text-5xl'>Waiting the quizz to start...</h1>
		</main>
	}

	return (
		<main className='flex flex-col min-h-screen min-w-full bg-slate-900 text-white gap-4'>
			<nav className="w-full mx-auto  py-4 bg-slate-800">
				<div className="mx-auto container flex items-center justify-between">
					<h1 className="text-xl font-bold">
						{room.name}
					</h1>
					<Link className='bg-slate-900 cursor-pointer rounded-lg px-4 py-2 font-bold' to={'/'}>Finish Test</Link>

				</div>
			</nav>
			<div className="container flex mx-auto gap-4">
				<div className='flex flex-col gap-2'>
					{ questions.map((question, index) => <div className='cursor-pointer w-12 text-xl font-bold h-12 flex items-center justify-center bg-slate-800 rounded-md' key={question.id} onClick={() => setSelectedId(question.id)}>{ index + 1 }</div>) }
				</div>
				<div className="flex flex-col items-start gap-4 w-full">
					<h1 className="text-2xl">
                        Question:
					</h1>
					<hr className="w-full opacity-30" />
					{ question && <>
						<h2 className='text-xl font-bold'>
							{question.title }
						</h2>
						<div className='grid grid-cols-4 gap-4 w-full'>
							{ question.answers.map((answer) => {
								return <div onClick={() => {
									question.selectedOne = answer
									setQuestions([
										...questions
									])
								} } className={`bg-slate-800 border ${ answer === question.selectedOne ? 'border-white' :   'border-slate-800'} rounded-lg px-4 py-2 cursor-pointer`} key={answer}>
									{ answer}
								</div>
							})}
						</div>
					</>}
					
				</div>
			</div>
		</main>
	) 
} 