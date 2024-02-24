import { Link } from '@remix-run/react'
import { useState } from 'react'
import { Question } from 'src/utils/types/question'

export default function Page () {
	const [ questions, setQuestions ] = useState<Question[]>([])

	return (
		<main className='flex flex-col min-h-screen min-w-full bg-slate-900 text-white gap-4'>
			<nav className="w-full mx-auto  py-4 bg-slate-800">
				<div className="mx-auto container flex items-center justify-between">
					<h1 className="text-xl font-bold">
						Create a new Test
					</h1>
					<Link className='bg-slate-900 cursor-pointer rounded-lg px-4 py-2 font-bold' to={'/'}>Cancel</Link>

				</div>
			</nav>
			<div className="container flex flex-col items-start mx-auto gap-4">
				<input className='bg-transparent rounded-lg  px-4 py-1 border border-slate-700' type="text" placeholder='Title of your test' />
				<hr className='w-full' />
				<button onClick={() => setQuestions(questions => [...questions, {
					id: `${questions.length + 1}` ,
					title: '',
					answers: [],
				}])} className='bg-slate-800 cursor-pointer rounded-lg px-4 py-2 font-bold'>Add a question</button>
				
				<div className='flex flex-col w-1/2 gap-2'>
					{ questions.map((question) => {
						return <div className='w-full rounded-lg bg-slate-800 px-4 py-2 flex flex-col items-start gap-2' key={question.id}>
							<input onChange={(e) => {
								question.title = e.currentTarget.value
								setQuestions(q => [...q])
							}} placeholder='Question' className='bg-transparent px-2 border border-slate-800 text-white'  type="text" value={question.title} />
							<hr className='w-full' />
							{ question.answers.map((answer) => {
								return <div className={`w-full px-2 py-1 rounded-md bg-slate-900 cursor-pointer border ${answer === question.selectedOne ? 'border-white' : 'border-slate-900'} `} onClick={() => {
									question.selectedOne = answer
									setQuestions(q => [...q])

								}} key={answer}>
									{ answer }
								</div>
							}) }
							<button onClick={() => {
								const answer = prompt('Add a possiblity')
								if (answer) {
									question.answers.push(answer)
									setQuestions(q => [...q])
								}
								
							}} className='bg-slate-900 cursor-pointer rounded-lg px-4 py-2'>Add Answer</button>
						</div>
					}) }
				</div>
				<hr className='w-full' />
				<Link className='bg-slate-800 cursor-pointer rounded-lg px-4 py-2 font-bold' to={'/'}>Validate</Link>
			</div>
		</main>
	) 
} 