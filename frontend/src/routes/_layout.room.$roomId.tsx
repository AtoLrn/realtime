import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

interface State {
	isAllowed?: boolean,
	isConnected: boolean
}

export const loader = async ({ params }: LoaderFunctionArgs) => {

	return json({
		socketUrl: process.env.SOCKET_URL!,
		roomId: params.roomId
	})
}

export default function Layout () {
	const { roomId, socketUrl } = useLoaderData<typeof loader>()

	const [ state, setState ] = useState<State>({
		isAllowed: undefined,
		isConnected: false
	})

	useEffect(() => {
		const socket = io(socketUrl)

		socket.on('joined', ({ joined }) => {
			setState({
				isAllowed: joined,
				isConnected: joined
			})
		})

		socket.emit('joinRoom', { roomId })
	}, [])
	
	return <div className="container mt-24 flex mx-auto gap-8 flex-col items-center">
		{ state.isAllowed === false 
			?<h1 className='text-4xl'>Cannot join room #{roomId}</h1>
			: <h1 className='text-4xl'>{!state.isConnected ? 'Joining a room' : 'Joined room'}#{roomId}</h1>
		}
		
		<div className='flex items-center flex-col z-20 w-5/6 xl:w-1/2 gap-12 xl:gap-8'>
			
		</div>
	</div>
}
