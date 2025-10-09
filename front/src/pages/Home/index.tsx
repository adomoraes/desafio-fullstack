import { useApi } from "../../hooks/useApi"
import { PlanCard } from "../../components/PlanCard"
import { PlanHistory } from "../../components/PlanHistory"

interface Plan {
	id: number
	description: string
	numberOfClients: number
	gigabytesStorage: number
	price: number
	active: boolean
}

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

export const Home = () => {
	const {
		data: plans,
		loading: plansLoading,
		error: plansError,
	} = useApi<Plan[]>("/plans")
	const {
		data: user,
		loading: userLoading,
		error: userError,
	} = useApi<User>("/user")

	const loading = plansLoading || userLoading
	const error = plansError || userError

	const activePlanId = user?.contrato_ativo?.plan_id
	const hasActivePlan = !!activePlanId

	if (loading) {
		return <div>Loading...</div>
	}

	if (error) {
		return <div>Error: {error.message}</div>
	}

	return (
		<div className='flex flex-col items-center justify-center min-h-screen py-8'>
			<h1 className='text-sky-900 text-2xl mb-4'>Dashboard de Planos</h1>

			<PlanHistory />

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8'>
				{plans?.map((plan) => (
					<PlanCard
						key={plan.id}
						plan={plan}
						hasActivePlan={hasActivePlan}
						isActivePlan={plan.id === activePlanId}
					/>
				))}
			</div>
		</div>
	)
}
