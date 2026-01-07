<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Deposit extends Model
{
    protected $guarded = ['id'];

    protected $dates = ['start_date', 'end_date'];

    public function account()
    {
        return $this->belongsTo(AccountDetail::class, 'account_id');
    }

    public function withdrawals()
    {
        return $this->hasMany(Withdrawal::class);
    }

    public function memberDetail()
    {
        return $this->hasOne(Member::class, 'sno', 'member_sno');
    }

    public function totalWithdrawn()
    {
        return $this->withdrawals()->sum('amount');
    }

    public function balance()
    {
        return $this->amount - $this->totalWithdrawn();
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'account_id', 'account_id');
    }
    public function getAmount()
    {
        return $this->belongsTo(Transaction::class, 'id', 'id');
    }
    public function getFdAmountAttribute()
    {
        return Transaction::where('account_id', $this->account_id)
            ->where('reference', 'DEP-' . $this->id)
            ->first();
    }
}
