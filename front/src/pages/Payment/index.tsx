import { useParams, useNavigate } from "react-router-dom"
import { useApi } from "../../hooks/useApi"
import { useEffect, useState } from "react"

interface Plan {
	id: number
	description: string
	numberOfClients: number
	gigabytesStorage: number
	price: number
	active: boolean
}

interface Calculation {
	credit: number
	finalPrice: number
}

export const Payment = () => {
	const { planId } = useParams<{ planId: string }>()
	const navigate = useNavigate()

	const {
		data: plans,
		loading: plansLoading,
		error: plansError,
	} = useApi<Plan[]>("/plans")

	const { post: createContrato, loading: contratoLoading } =
		useApi("/contratos")

	const {
		data: calculation,
		loading: calculationLoading,
		error: calculationError,
	} = useApi<Calculation>(planId ? `/contratos/calculate/${planId}` : null)

	const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

	useEffect(() => {
		if (plans && planId) {
			const plan = plans.find((p) => p.id === parseInt(planId, 10))
			setSelectedPlan(plan || null)
		}
	}, [plans, planId])

	const handlePayment = async () => {
		if (!planId) return
		try {
			await createContrato({ plan_id: parseInt(planId, 10) })
			alert("Pagamento confirmado com sucesso!")
			navigate("/")
		} catch (error) {
			alert("Erro ao processar pagamento.")
		}
	}

	const loading = plansLoading || calculationLoading

	if (loading) {
		return (
			<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white'>
				Carregando resumo...
			</div>
		)
	}

	if (plansError || calculationError) {
		return (
			<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white'>
				Erro ao carregar dados.
			</div>
		)
	}

	if (!selectedPlan) {
		return (
			<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white'>
				Plano não encontrado.
			</div>
		)
	}

	const creditPercentage =
		selectedPlan.price > 0 && calculation?.credit
			? (calculation.credit / selectedPlan.price) * 100
			: 0

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
				<h2 className='text-2xl font-bold mb-4'>Resumo da Troca</h2>

				<div className='border p-4 rounded-lg mb-4'>
					<h3 className='text-xl font-semibold'>{selectedPlan.description}</h3>
					<p className='text-2xl font-bold mt-2'>
						R$ {Number(selectedPlan.price).toFixed(2)}
						<span className='text-lg font-normal text-gray-500'>/mês</span>
					</p>
				</div>

				{calculation?.credit && calculation.credit > 0 && (
					<div className='mb-4'>
						<h4 className='font-semibold'>Crédito do Plano Anterior:</h4>
						<p className='text-green-600'>- R$ {calculation.credit.toFixed(2)}</p>
						<div className='w-full bg-gray-200 rounded-full h-2.5 mt-2'>
							<div
								className='bg-green-500 h-2.5 rounded-full'
								style={{ width: `${creditPercentage}%` }}></div>
						</div>
					</div>
				)}

				<div className='text-xl font-bold mb-4'>
					<span>Total a Pagar: </span>
					<span>R$ {calculation?.finalPrice?.toFixed(2) ?? "0.00"}</span>
				</div>

				<button
					onClick={handlePayment}
					disabled={contratoLoading}
					className='w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400'>
					{contratoLoading ? "Processando..." : "Confirmar Pagamento"}
				</button>
				<button
					onClick={() => navigate("/")}
					className='w-full mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'>
					Cancelar
				</button>
			</div>
		</div>
	)
}
