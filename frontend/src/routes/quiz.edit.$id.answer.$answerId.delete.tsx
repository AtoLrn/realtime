import {LoaderFunctionArgs, redirect} from '@remix-run/node'
import {getSession} from 'src/core/services/session.service.server'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'))

    if (!session.has('jwt')) {
        return redirect('/')
    }

	try {
		if (!params.id && !params.answerId) {
			redirect('/')
		}

        await fetch(`${process.env.API_URL}/api/answer/${params.answerId}`, {
            method: 'DELETE',
        })

		return redirect(`/quiz/edit/${params.id}`)
	} catch(e) {
		return redirect(`/quiz/edit/${params.id}`)
	}
}
