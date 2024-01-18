import { json } from '@remix-run/node'
import { Chat } from 'src/components/Chat'
import { Link, useLoaderData } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { FaBook, FaRegCalendar } from 'react-icons/fa'
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
		}, 0)
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
			<div className="container flex items-start mx-auto gap-4">
				<div className='px-8 py-4 flex flex-col gap-8 w-1/4 bg-slate-800 rounded-md'>
					<h1 className='font-bold'>
						Quizz
					</h1>
					<div className='flex gap-4 px-2 items-center'>
						<div className='h-12 w-12 rounded-lg flex items-center justify-center bg-slate-600'>
							<FaBook size={16} />
						</div>
						<h2 className='flex-1'>
							{ room.name }
						</h2>
					</div>
					<div className='flex flex-col gap-4'>
						<h1 className='font-bold'>
						Questions
						</h1>
						{ questions.map((question, index) => {
							return <div className='cursor-pointer flex gap-4 px-2 items-center' onClick={() => setSelectedId(question.id)} key={question.id}>
								<div className={`h-12 w-12 rounded-lg flex items-center justify-center bg-slate-600 border ${ question.id === selectedId ? 'border-white' : 'border-slate-600' }`}>
									<FaRegCalendar size={16} />								
								</div>
								<h2 className='flex-1'>
									<b>{index + 1}.</b> { question.title }
								</h2>
							</div>
					
						}) }
					</div>
					
				</div>
				<div className="relative flex flex-col items-center gap-4 w-2/4 px-8 py-4 bg-slate-800 rounded-md pt-44 mt-32">
					{ question && <>
						{question.title.length % 2 === 0 
							?  <img className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3' src="/img/question.png" alt="" />
							: 						<img className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3' src="/img/nerd.png" alt="" />
						}
						<div className='w-full flex text-2xl gap-4'>
							<span className='font-bold'>
								1.
							</span>
							<h2 className='font-bold'>
								{question.title }
							</h2>
						</div>
						
						<div className='grid grid-cols-1 gap-4 w-full'>
							{ question.answers.map((answer) => {
								return <div onClick={() => {
									question.selectedOne = answer
									setQuestions([
										...questions
									])
								} } className={`bg-slate-600 border ${ answer === question.selectedOne ? 'border-white' :   'border-slate-600'} rounded-lg px-4 py-2 cursor-pointer`} key={answer}>
									{ answer}
								</div>
							})}
						</div>
					</>}
					
				</div>
			</div>
            <Chat />
		</main>
	) 
} 
