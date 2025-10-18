<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'guard_name'
    ];

    /**
     * The users that belong to the role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * Create a new role or return an existing one.
     */
    public static function findOrCreate(string $name, string $guardName = 'web'): self
    {
        return static::firstOrCreate(
            ['name' => $name],
            ['guard_name' => $guardName]
        );
    }
}
