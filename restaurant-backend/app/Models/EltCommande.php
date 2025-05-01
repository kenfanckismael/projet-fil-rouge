<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EltCommande extends Model
{
    use HasFactory;

    protected $fillable = [
        'commande_id', 'plat_id', 'quantity', 'notes', 'prix'
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function plat()
    {
        return $this->belongsTo(Plat::class);
    }

}

