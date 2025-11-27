<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserDeviceDetails extends Model
{
    protected $guarded = ['id'];

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_number', 'member_number');
    }
}