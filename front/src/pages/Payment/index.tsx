import { useParams, useNavigate } from "react-router-dom"
import { useApi } from "../../hooks/useApi"
import { useEffect, useState } from "react"

interface Plan {
  id: number;
  description: string;
  numberOfClients: number;
  gigabytesStorage: number;
  price: number;
  active: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  contrato_ativo: {
    id: number;
    plan_id: number;
    user_id: number;
    is_active: boolean;
    start_date: string;
  } | null;
}

export const Payment = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  
  const { data: plans, loading: plansLoading, error: plansError } = useApi<Plan[]>('/plans');
  const { data: user, loading: userLoading, error: userError } = useApi<User>('/user');
  const { post: createContrato, loading: contratoLoading } = useApi('/contratos');

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [credit, setCredit] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    if (plans && planId) {
      const plan = plans.find(p => p.id === parseInt(planId, 10));
      setSelectedPlan(plan || null);
    }
  }, [plans, planId]);

  useEffect(() => {
    if (user && user.contrato_ativo && plans && selectedPlan) {
      const activePlan = plans.find(p => p.id === user.contrato_ativo?.plan_id);
      if (activePlan) {
        const startDate = new Date(user.contrato_ativo.start_date);
        const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
        const dailyRate = parseFloat(activePlan.price as any) / daysInMonth;
        const daysUsed = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        
        let calculatedCredit = parseFloat(activePlan.price as any) - (daysUsed * dailyRate);
        if (calculatedCredit < 0) {
          calculatedCredit = 0;
        }
        setCredit(calculatedCredit);
        
        let newFinalPrice = parseFloat(selectedPlan.price as any) - calculatedCredit;
        if (newFinalPrice < 0) {
          newFinalPrice = 0;
        }
        setFinalPrice(newFinalPrice);
      }
    } else if (selectedPlan) {
      setFinalPrice(parseFloat(selectedPlan.price as any));
    }
  }, [user, plans, selectedPlan]);

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

  const loading = plansLoading || userLoading;

  if (loading) {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">Loading...</div>;
  }

  if (plansError || userError) {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">Error loading data.</div>;
  }

  if (!selectedPlan) {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">Plano não encontrado.</div>;
  }

  const creditPercentage = selectedPlan.price > 0 ? (credit / selectedPlan.price) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Resumo da Troca</h2>
        
        <div className="border p-4 rounded-lg mb-4">
          <h3 className="text-xl font-semibold">{selectedPlan.description}</h3>
          <p className="text-2xl font-bold mt-2">R$ {parseFloat(selectedPlan.price as any).toFixed(2)}</p>
        </div>

        {credit > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold">Crédito do Plano Anterior:</h4>
            <p className="text-green-600">- R$ {credit.toFixed(2)}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${creditPercentage}%` }}></div>
            </div>
          </div>
        )}

        <div className="text-xl font-bold mb-4">
          <span>Total a Pagar: </span>
          <span>R$ {finalPrice.toFixed(2)}</span>
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
