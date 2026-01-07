<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountDetail extends Model
{
    protected $guarded = ['id'];

    public function memberDetail()
    {
        return $this->hasOne(Member::class, 'member_number', 'member_sno');
    }

    public function deposits()
    {
        return $this->hasMany(Deposit::class, 'account_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'account_id');
    }
}