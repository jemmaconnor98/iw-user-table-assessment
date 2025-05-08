<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller 
{
  public function index(Request $request)
  {
    $perPage = $request->input('per_page', 10);
    $search = $request->input('search');
    $sortColumn = $request->input('sort_column', 'name');
    $sortDirection = $request->input('sort_direction', 'asc');

    $query = User::query();

    if ($search) {
      $search = strtolower($search);
      $query->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"]);
    }

    if (in_array($sortColumn, ['name', 'email', 'created_at', 'email_verified_at'])) {
      $query->orderBy($sortColumn, $sortDirection);
    }

    $users = $query->paginate($perPage);

    return response()->json([
      'users' => $users->items(),
      'totalCount' => $users->total(),
      'currentPage' => $users->currentPage(),
      'lastPage' => $users->lastPage(),
    ]);
  }
}
