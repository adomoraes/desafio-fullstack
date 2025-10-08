<?php

namespace App\Http\Controllers;

use App\Models\Contrato;
use App\Models\Pagamento;
use App\Models\Plan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContratoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $contratos = Contrato::with(['plan', 'pagamentos'])->get();
        return response()->json($contratos);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_id' => 'required|exists:plans,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::first();
        $oldContrato = $user->getContratoAtivo();
        $credit = 0;

        if ($oldContrato) {
            $oldContrato->load('plan');
            $startDate = Carbon::parse($oldContrato->start_date);
            $daysInMonth = $startDate->daysInMonth;
            $dailyRate = $oldContrato->plan->price / $daysInMonth;
            $daysUsed = now()->diffInDays($startDate);
            
            $credit = $oldContrato->plan->price - ($daysUsed * $dailyRate);
            if ($credit < 0) {
                $credit = 0;
            }

            $oldContrato->is_active = false;
            $oldContrato->end_date = now();
            $oldContrato->save();
        }

        $newPlan = Plan::find($request->plan_id);
        $newAmount = $newPlan->price - $credit;
        if ($newAmount < 0) {
            $newAmount = 0;
        }

        $contrato = Contrato::create([
            'user_id' => $user->id,
            'plan_id' => $request->plan_id,
            'start_date' => Carbon::now(),
            'is_active' => true,
        ]);

        Pagamento::create([
            'contrato_id' => $contrato->id,
            'amount' => $newAmount,
            'due_date' => $contrato->start_date,
            'credit_used' => $credit,
        ]);

        return response()->json($contrato->load('pagamentos', 'plan'), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $contrato = Contrato::with(['plan', 'pagamentos'])->find($id);

        if (!$contrato) {
            return response()->json(['message' => 'Contrato not found'], 404);
        }

        return response()->json($contrato);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
