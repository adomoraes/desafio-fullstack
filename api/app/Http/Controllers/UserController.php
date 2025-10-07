<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

    /**
     * Display the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        $user = User::find(1);
        if ($user) {
            $user->contrato_ativo = $user->getContratoAtivo();
        }
        return $user;
    }
}
