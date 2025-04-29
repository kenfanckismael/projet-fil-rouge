<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Plat extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'prix', 'image',
        'disponible', 'en_vedette', 'categorie_id', 'restaurant_id'
    ];

    public function categorie()
    {
        return $this->belongsTo(Category::class, 'categorie_id');
    }

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
