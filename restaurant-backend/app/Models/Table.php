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

    /**
     * Relation : une table appartient à un restaurant.
     */
    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    /**
     * Génère un QR code vers l'URL client et stocke le fichier.
     *
     * @param string $baseUrl L'URL de base (ex: https://localhost:5173)
     * @return string Le chemin du QR code enregistré dans le disque public.
     */
    public function generateQrCode(string $baseUrl): string
    {
        $url = "{$baseUrl}/client/{$this->code}";

        // Nom de fichier sécurisé avec ID et code
        $filename = "qrcodes/table_{$this->id}_{$this->code}.png";

        // Génére le QR code en format PNG
        $qrCode = QrCode::format('png')->size(300)->generate($url);

        // Sauvegarde dans storage/app/public/qrcodes/
        Storage::disk('public')->put($filename, $qrCode);

        // Met à jour le chemin dans la table si nécessaire
        $this->update(['qr_code_path' => $filename]);

        return $filename;
    }
}
