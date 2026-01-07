<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Withdrawal extends Model
{
    protected $guarded = ['id'];

    public function deposit()
    {
        return $this->belongsTo(Deposit::class);
    }
}
