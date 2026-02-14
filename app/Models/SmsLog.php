<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsLog extends Model
{
    protected $guarded = ['id'];

    public function memberDetail()
    {
        return $this->hasOne(Member::class, 'phone_number', 'phone_number');
    }
}