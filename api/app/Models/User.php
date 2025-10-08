<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    protected $hidden = ['created_at', 'updated_at'];

    public function contratos(): HasMany
    {
        return $this->hasMany(Contrato::class);
    }

    public function getContratoAtivo()
    {
        return $this->contratos()->where('is_active', true)->first();
    }
}
