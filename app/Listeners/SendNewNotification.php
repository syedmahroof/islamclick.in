<?php

namespace App\Listeners;

use App\Events\NewNotificationEvent;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification as NotificationFacade;
use Illuminate\Support\Str;

class SendNewNotification implements ShouldQueue
{
    /**
     * The name of the queue the job should be sent to.
     *
     * @var string|null
     */
    public $queue = 'notifications';

    /**
     * Handle the event.
     */
    public function handle(NewNotificationEvent $event): void
    {
        $user = $event->user;
        $notificationData = $event->notification;

        // Ensure the notification has a unique ID if not provided
        if (!isset($notificationData['id'])) {
            $notificationData['id'] = (string) Str::uuid();
        }

        // Add timestamp if not provided
        if (!isset($notificationData['created_at'])) {
            $notificationData['created_at'] = now()->toDateTimeString();
        }

        // Store the notification in the database
        $user->notifications()->create([
            'id' => $notificationData['id'],
            'type' => $notificationData['type'] ?? 'App\Notifications\GenericNotification',
            'data' => $notificationData,
            'read_at' => null,
        ]);

        // Broadcast the notification to the user's private channel
        // This will be handled by the NewNotificationEvent's broadcastOn method
    }

    /**
     * Handle a job failure.
     */
    public function failed(NewNotificationEvent $event, \Throwable $exception): void
    {
        // Log the failure
        \Log::error('Failed to send notification: ' . $exception->getMessage(), [
            'user_id' => $event->user->id,
            'notification' => $event->notification,
            'exception' => $exception,
        ]);
    }
}
