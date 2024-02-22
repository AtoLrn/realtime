import * as Popover from '@radix-ui/react-popover'
import { Form, useFetcher, useLoaderData, useLocation } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import { TiMessages } from 'react-icons/ti'
import { ActionFunctionArgs, LoaderFunctionArgs, defer } from '@remix-run/node'
import {getSession} from 'src/core/services/session.service.server'
import { Room } from 'src/utils/types/room'

export interface Message {
	message: string,
	userId: string
}

export interface ChatProps {
    room: Room
}

export const Chat: React.FC<ChatProps> = ({ room }) => {
	const form = useFetcher({
		key: 'chat' 
	})
	const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        const fd = form.formData
		if (!fd) { return }
        const message = fd.get('message')

        console.log(message)
    }, [form.data])

    console.log(room)

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
				</div>
				<Form method='POST' fetcherKey='chat' navigate={false} className='flex w-full gap-2'>
					<input 
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
