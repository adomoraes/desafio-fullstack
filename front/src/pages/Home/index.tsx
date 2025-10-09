import { useApi } from '../../hooks/useApi'
import { PlanCard } from '../../components/PlanCard'

interface Plan {
  id: number
  description: string
  numberOfClients: number
  gigabytesStorage: number
  price: number
  active: boolean
}

export const Home = () => {
  const { data: plans, loading, error } = useApi<Plan[]>('/plans')

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <h1 className="text-orange-400 text-2xl mb-4">
        Desafio para Desenvolvedor - Inmediam
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans?.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  )
}