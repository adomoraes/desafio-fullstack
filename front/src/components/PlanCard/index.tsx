import { useNavigate } from "react-router-dom"

interface Plan {
	id: number
	description: string
	numberOfClients: number
	gigabytesStorage: number
	price: number
	active: boolean
}

interface PlanCardProps {
	plan: Plan
	hasActivePlan: boolean
	isActivePlan: boolean
}

export const PlanCard = ({
	plan,
	hasActivePlan,
	isActivePlan,
}: PlanCardProps) => {
	const navigate = useNavigate()

	const handleSelectPlan = () => {
		navigate(`/payment/${plan.id}`)
	}

	const buttonText = isActivePlan
		? "Plano Atual"
		: hasActivePlan
		? "Trocar Plano"
		: "Assinar"

	return (
		<div
			className={`border p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 ${
				isActivePlan ? "bg-green-100" : ""
			}`}>
			<h2 className='text-2xl font-bold mb-2'>{plan.description}</h2>
			<p className='text-gray-600'>{plan.numberOfClients} clientes</p>
			<p className='text-gray-600'>
				{plan.gigabytesStorage} GB de armazenamento
			</p>
			<p className='text-4xl font-bold mt-4'>
        R$ {plan.price} <span className="text-lg font-normal text-gray-500">/mês</span>
      </p>
			<button
				onClick={handleSelectPlan}
				disabled={isActivePlan}
				className='mt-4 w-full bg-sky-700 text-white py-2 px-4 rounded-3xl hover:bg-sky-800 disabled:bg-gray-400 disabled:cursor-not-allowed'>
				{buttonText}
			</button>
		</div>
	)
}
