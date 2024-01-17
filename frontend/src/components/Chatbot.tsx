import * as Popover from '@radix-ui/react-popover'
import { Form, useFetcher, useLoaderData, useLocation } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import { TiMessages } from 'react-icons/ti'
import { LoaderFunctionArgs, defer } from '@remix-run/node'

export interface Message {
	message: string,
	userId: string
}

//export const loader = async ({ request }: LoaderFunctionArgs) => {
	//const connectedUserId = JSON.parse(localStorage.getItem("userId") as string)

	//return defer({
		//connectedUserId
	//})
//}


export const Chatbot = () => {
	//const { connectedUserId } = useLoaderData<typeof loader>()

    const [ messages, setMessages ] = useState<Message[]>([])
    const [ botMessage, setBotMessage ] = useState('')
    const [ sseLoading, setSseLoading ] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    return <Popover.Root>
		<Popover.Trigger asChild>
			<div className='border border-gray-800 fixed z-50 right-8 bottom-8 rounded-full bg-slate-600 shadow cursor-pointer h-16 w-16 flex flex-col items-center justify-center'>
				<TiMessages size={24} />
			</div>
		</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content 
				sideOffset={10}
				alignOffset={10}
				className='w-96 mr-8 border border-gray-800  z-50 p-4 gap-2 rounded-md bg-slate-600 shadow cursor-pointer flex flex-col items-center justify-start'>
	
				<h1 className='text-white'>Chat</h1>
				<hr className='w-full' />
				<div className='flex flex-col gap-2 w-full h-auto'>
					{ messages.map(({message, userId}) => {
						if (userId === connectedUserId)
                            return <div key={message} className='rounded-md bg-red-50 px-2 py-1 self-end ml-8'>
                                { message }
                            </div>
                        return <div key={message} className='rounded-md bg-violet-400 text-white px-2 py-1 self-start mr-8'>
                            {message}
                        </div>

					})}
				</div>
				<Form ref={formRef} fetcherKey='chatbot-post' method='POST' navigate={false} action='/chatbot/job' className='flex w-full gap-2'>
					<input name="history" type='hidden' value={ JSON.stringify(messages) }  />
					<input 
						disabled={sseLoading}
						autoComplete='off' name="message" type="text"
						className='bg-transparent w-full border border-gray-200 text-white outline-none rounded-lg px-2 py-1'
						placeholder='No cheating !' />
					<input type="hidden" value={"test"} name='slug' />
					<button  className='rounded-md bg-slate-800 px-4 py-1 text-white hover:bg-slate-900 duration-300'>
					Send
					</button>
				</Form>
			
			</Popover.Content>
		</Popover.Portal>
  </Popover.Root>
}
