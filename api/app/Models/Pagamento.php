<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pagamento extends Model
{
    use HasFactory;

    protected $fillable = [
        'contrato_id',
        'amount',
        'payment_date',
        'due_date',
        'status',
        'credit_used',
    ];

    public function contrato(): BelongsTo
    {
        return $this->belongsTo(Contrato::class);
    }
}
