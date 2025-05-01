<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'restaurant_id', 'table_id', 'total_prix',
        'status', 'payment_method', 'payment_status', 'service_type'
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function elt_commandes()
    {
        return $this->hasMany(EltCommande::class);

    }
    public function recalculerTotalPrix()
    {
        $total = $this->elt_commandes->sum(function ($elt) {
            return $elt->prix * $elt->quantity;
        });

        $this->total_prix = $total;
        $this->save();
    }
}
