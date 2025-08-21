<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $employee = \App\Models\Employee::factory()->for($user)->create();

    $this->actingAs($user)
         ->get('/dashboard')
         ->assertOk();
});
