<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Restaurant extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'description', 'logo', 'image', 
        'address', 'phoneNumber', 'email'
    ];
}
