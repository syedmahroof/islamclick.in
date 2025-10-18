<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AdminController extends Controller
{
    /**
     * The model class name that this controller manages.
     *
     * @var string
     */
    protected $modelClass;

    /**
     * The resource name for response messages.
     *
     * @var string
     */
    protected $resourceName;

    /**
     * The number of models to return for pagination.
     *
     * @var int
     */
    protected $perPage = 15;

    /**
     * Get the base query for index method.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function getIndexQuery(Request $request)
    {
        $query = $this->modelClass::query();

        // Apply search if search parameter is provided
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where('name', 'like', $searchTerm);
        }

        // Apply sorting
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_dir', 'desc');
        $query->orderBy($sortField, $sortDirection);

        return $query;
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = $this->getIndexQuery($request);
        $items = $query->paginate($request->input('per_page', $this->perPage));
        
        if ($request->wantsJson()) {
            return response()->json([
                'data' => $items->items(),
                'meta' => [
                    'current_page' => $items->currentPage(),
                    'last_page' => $items->lastPage(),
                    'per_page' => $items->perPage(),
                    'total' => $items->total(),
                ]
            ]);
        }
        
        // Get the resource name from the child controller or use a default
        $resourceName = $this->resourceName ?? 'resource';
        $view = 'Admin/' . ucfirst($resourceName) . 's/Index';
        
        return inertia($view, [
            $resourceName . 's' => $items->toArray()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $item = $this->modelClass::create($validated);

        return response()->json([
            'message' => ucfirst($this->resourceName) . ' created successfully.',
            'data' => $item
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $item = $this->modelClass::findOrFail($id);
        return response()->json(['data' => $item]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return mixed
     */
    public function update(Request $request, string $id)
    {
        $item = $this->modelClass::findOrFail($id);
        $validated = $this->validateRequest($request, $item->id);
        $item->update($validated);

        return response()->json([
            'message' => ucfirst($this->resourceName) . ' updated successfully.',
            'data' => $item
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $item = $this->modelClass::findOrFail($id);
        $item->delete();

        return response()->json([
            'message' => ucfirst($this->resourceName) . ' deleted successfully.'
        ]);
    }

    /**
     * Validate the request data.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int|null  $id
     * @return array
     */
    protected function validateRequest(Request $request, $id = null): array
    {
        // This method should be overridden in child controllers
        return $request->validate([
            'name' => 'required|string|max:255',
        ]);
    }
}
