import { useApi } from '../../hooks/useApi';

interface User {
  id: number;
  name: string;
  email: string;
  contrato_ativo: {
    id: number;
    plan_id: number;
    user_id: number;
    is_active: boolean;
  } | null;
}

interface Plan {
  id: number;
  description: string;
  numberOfClients: number;
  gigabytesStorage: number;
  price: number;
  active: boolean;
}

export const CurrentPlan = () => {
  const { data: user, loading: userLoading, error: userError } = useApi<User>('/user');
  const { data: plans, loading: plansLoading, error: plansError } = useApi<Plan[]>('/plans');

  if (userLoading || plansLoading) {
    return <div>Loading current plan...</div>;
  }

  if (userError || plansError) {
    return <div>Error fetching data.</div>;
  }

  const activePlan = plans?.find(plan => plan.id === user?.contrato_ativo?.plan_id);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Plano Atual</h2>
      {activePlan ? (
        <div>
          <h3 className="text-xl font-semibold">{activePlan.description}</h3>
          <p>{activePlan.numberOfClients} clientes</p>
          <p>{activePlan.gigabytesStorage} GB de armazenamento</p>
          <p className="text-2xl font-bold mt-4">R$ {activePlan.price}</p>
        </div>
      ) : (
        <p>Nenhum plano contratado no momento.</p>
      )}
    </div>
  );
};