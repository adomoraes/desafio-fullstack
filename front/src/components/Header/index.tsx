import { useApi } from "../../hooks/useApi"

interface User {
	id: number
	name: string
	email: string
	contrato_ativo: {
		id: number
		plan_id: number
		user_id: number
		is_active: boolean
	} | null
}

export const Header = () => {
	const { data: user, loading, error } = useApi<User>("/user")

	if (loading)
		return (
			<header className='h-16 bg-gray-800 text-white flex items-center justify-center fixed top-0 w-full'>
				Loading...
			</header>
		)
	if (error)
		return (
			<header className='h-16 bg-red-800 text-white flex items-center justify-center fixed top-0 w-full'>
				Error fetching user
			</header>
		)

	return (
		<header className='h-16 bg-gray-900 text-white flex items-center justify-between px-8 fixed top-0 w-full'>
			<h1 className='text-xl font-bold'>Inmediam</h1>
			<div>
				<span>{user?.name}</span>
			</div>
		</header>
	)
}
