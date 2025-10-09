import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useEffect, useState } from 'react';

interface Plan {
  id: number;
  description: string;
  price: number;
}

export const Payment = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { data: plans, loading: plansLoading, error: plansError } = useApi<Plan[]>('/plans');
  const { post: createContrato, loading: contratoLoading } = useApi('/contratos');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    if (plans && planId) {
      const plan = plans.find(p => p.id === parseInt(planId, 10));
      setSelectedPlan(plan || null);
    }
  }, [plans, planId]);

  const handlePayment = async () => {
    if (!planId) return;
    try {
      await createContrato({ plan_id: parseInt(planId, 10) });
      alert('Pagamento confirmado com sucesso!');
      navigate('/');
    } catch (error) {
      alert('Erro ao processar pagamento.');
    }
  };

  if (plansLoading) {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">Loading plans...</div>;
  }

  if (plansError) {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">Error loading plans.</div>;
  }

  if (!selectedPlan) {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">Plano não encontrado.</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Pagamento</h2>
        <p className="mb-4">Você está prestes a assinar o plano:</p>
        <div className="border p-4 rounded-lg mb-4">
          <h3 className="text-xl font-semibold">{selectedPlan.description}</h3>
          <p className="text-2xl font-bold mt-2">R$ {selectedPlan.price}</p>
        </div>
        <button
          onClick={handlePayment}
          disabled={contratoLoading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {contratoLoading ? 'Processando...' : 'Confirmar Pagamento'}
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};