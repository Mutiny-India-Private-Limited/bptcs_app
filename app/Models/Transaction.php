<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $guarded = ['id'];

    public function account()
    {
        return $this->belongsTo(AccountDetail::class, 'account_id');
    }
}
