import { useEffect, useState } from 'react'
import { api } from '../../services/api'

interface Plan {
  id: number
  description: string
  numberOfClients: number
  gigabytesStorage: number
  price: number
  active: boolean
}

export const Home = () => {
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    api.get('/plans').then((response) => {
      setPlans(response.data)
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-orange-400 text-2xl mb-4">
        Desafio para Desenvolvedor - Inmediam
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{plan.description}</h2>
            <p>Clientes: {plan.numberOfClients}</p>
            <p>Armazenamento: {plan.gigabytesStorage} GB</p>
            <p>Preço: R$ {plan.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}