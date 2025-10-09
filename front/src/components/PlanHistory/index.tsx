import { useApi } from '../../hooks/useApi';

interface Plan {
  id: number;
  description: string;
  numberOfClients: number;
  gigabytesStorage: number;
  price: number;
  active: boolean;
}

interface Contrato {
  id: number;
  plan: Plan;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

export const PlanHistory = () => {
  const { data: contratos, loading, error } = useApi<Contrato[]>('/contratos');

  if (loading) {
    return <div>Loading history...</div>;
  }

  if (error) {
    return <div>Error fetching history.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Histórico de Planos</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Plano</th>
            <th className="px-4 py-2">Início</th>
            <th className="px-4 py-2">Fim</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {contratos?.map(contrato => (
            <tr key={contrato.id}>
              <td className="border px-4 py-2">{contrato.plan.description}</td>
              <td className="border px-4 py-2">{new Date(contrato.start_date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{contrato.end_date ? new Date(contrato.end_date).toLocaleDateString() : '-'}</td>
              <td className="border px-4 py-2">{contrato.is_active ? 'Ativo' : 'Inativo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};