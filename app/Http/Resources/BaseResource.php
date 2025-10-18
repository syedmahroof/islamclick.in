<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BaseResource extends JsonResource
{
    /**
     * The default date format for JSON serialization.
     *
     * @var string
     */
    protected $dateFormat = 'Y-m-d H:i:s';

    /**
     * The "data" wrapper that should be applied.
     *
     * @var string|null
     */
    public static $wrap = 'data';

    /**
     * Format a date for the response.
     *
     * @param  mixed  $date
     * @return string|null
     */
    protected function formatDate($date)
    {
        if (is_null($date)) {
            return null;
        }

        if ($date instanceof Carbon) {
            return $date->format($this->dateFormat);
        }

        return $date;
    }

    /**
     * Get the resource's attributes as an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function getResourceAttributes($request)
    {
        return parent::toArray($request);
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return $this->getResourceAttributes($request);
    }

    /**
     * Customize the outgoing response for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\JsonResponse  $response
     * @return void
     */
    public function withResponse($request, $response)
    {
        $response->header('Content-Type', 'application/json; charset=utf-8');
    }
}
