<?php

namespace Database\Seeders;

use App\Models\Contrato;
use App\Models\Pagamento;
use App\Models\Plan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ContratoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::first();
        $plan1 = Plan::find(2);
        $plan2 = Plan::find(3);

        // Old, inactive contract
        $oldContrato = Contrato::create([
            'user_id' => $user->id,
            'plan_id' => $plan1->id,
            'start_date' => Carbon::now()->subMonths(2),
            'end_date' => Carbon::now()->subMonths(1),
            'is_active' => false,
        ]);

        Pagamento::create([
            'contrato_id' => $oldContrato->id,
            'amount' => $plan1->price,
            'due_date' => $oldContrato->start_date,
            'credit_used' => 0,
        ]);

        // Current, active contract
        $activeContrato = Contrato::create([
            'user_id' => $user->id,
            'plan_id' => $plan2->id,
            'start_date' => Carbon::now()->subDays(15),
            'is_active' => true,
        ]);

        Pagamento::create([
            'contrato_id' => $activeContrato->id,
            'amount' => $plan2->price, // Assuming first payment was full price
            'due_date' => $activeContrato->start_date,
            'credit_used' => 0,
        ]);
    }
}
