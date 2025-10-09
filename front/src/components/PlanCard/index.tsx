interface Plan {
  id: number;
  description: string;
  numberOfClients: number;
  gigabytesStorage: number;
  price: number;
  active: boolean;
}

interface PlanCardProps {
  plan: Plan;
}

export const PlanCard = ({ plan }: PlanCardProps) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">{plan.description}</h2>
      <p className="text-gray-600">{plan.numberOfClients} clientes</p>
      <p className="text-gray-600">{plan.gigabytesStorage} GB de armazenamento</p>
      <p className="text-4xl font-bold mt-4">R$ {plan.price}</p>
      <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
        Contratar
      </button>
    </div>
  );
};