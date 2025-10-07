<?php

namespace App\Http\Controllers;

use App\Models\Contrato;
use App\Models\Pagamento;
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
        //
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

        // For simplicity, we're getting the first user as the "logged in" user
        $user = User::first();

        // Deactivate all other contracts for this user
        Contrato::where('user_id', $user->id)->update(['is_active' => false]);

        $contrato = Contrato::create([
            'user_id' => $user->id,
            'plan_id' => $request->plan_id,
            'start_date' => Carbon::now(),
            'is_active' => true,
        ]);

        $contrato->load('plan');

        Pagamento::create([
            'contrato_id' => $contrato->id,
            'amount' => $contrato->plan->price,
            'due_date' => $contrato->start_date,
        ]);

        return response()->json($contrato->load('pagamentos'), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
