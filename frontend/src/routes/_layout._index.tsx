
// export async function loader({request}: LoaderFunctionArgs) {

import { Link } from '@remix-run/react'
import { Room } from 'src/utils/types/room'
	
// } 

export default function MainPage() { 
	const rooms: Room[] = [{
		id: 'abcd2',
		name: 'Superbe test',
		currentPeople: 12,
		maxPeope: 20
	}, {
		id: 'abcd3',
		name: 'Superbe test 2'
	}, {
		id: 'abcd4',
		name: 'Superbe test',
		currentPeople: 12,
		maxPeope: 20
	}]

	return (
        <div className="container flex mx-auto gap-4">
            <div className="flex-1 flex flex-col items-start gap-4">
                <h1 className="text-2xl">
                    Rooms
                </h1>
                <hr className="w-full opacity-30" />
                <div className="flex flex-col items-start gap-3 w-full">
                    { rooms.map((room) => {
                        return <Link key={room.id} to={`/room/${room.id}`} className='w-full'>
                            <div className='w-full bg-slate-800 flex justify-between gap-4 px-4 py-2 rounded-lg cursor-pointer'>
                                <h1>{room.name}</h1>
                                { room.currentPeople !== undefined && room.maxPeope !== undefined && <div className='flex items-center gap-1 opacity-70'>
                                    <span>{room.currentPeople}</span>
                                    <span>/</span>
                                    <span>{room.maxPeope}</span>
                                </div> }
                            </div>
                        </Link>
                    }) }
                </div>

            </div>
            <div className="flex-1 flex flex-col items-start gap-4">
                <h1 className="text-2xl">
                    Organise a test
                </h1>
                <hr className="w-full opacity-30" />
                <Link className='bg-slate-800 cursor-pointer rounded-lg px-4 py-2 uppercase font-bold' to={'/new-test'}>Create a test</Link>
            </div>
        </div>
	)
}

