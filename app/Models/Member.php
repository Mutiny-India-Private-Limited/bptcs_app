<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    // protected $connection = 'members_db'; //  Use secondary DB
    protected $table = 'member_details'; // Table name in members DB

    public $timestamps = false; // if your table doesn’t have timestamps
}