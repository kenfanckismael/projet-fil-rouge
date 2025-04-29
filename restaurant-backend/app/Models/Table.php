<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class Table extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'nb_place',
        'active',
        'restaurant_id',
        'qr_code_path',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
    public function generateQrCode($baseUrl)
    {
        $url = "{$baseUrl}/client?table={$this->code}";
        
        // Générer le QR code
        $qrCode = QrCode::format('png')
            ->size(300)
            ->generate($url);
        
        $path = "qrcodes/table_{$this->code}.png";
        Storage::disk('public')->put($path, $qrCode);
        
        $this->update(['qr_code_path' => $path]);
        
        return $path;
    }

    
}
