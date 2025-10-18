<?php

namespace App\Traits;

use App\Events\NewNotificationEvent;
use App\Models\User;
use Illuminate\Support\Facades\Log;

/**
 * Trait for models that can send notifications.
 */
trait HasNotifications
{
    /**
     * Send a notification to a user.
     *
     * @param  User|array  $users  Single user or array of users to notify
     * @param  string  $type  Type of notification (e.g., 'lead.created', 'task.assigned')
     * @param  string  $title  Notification title
     * @param  string  $message  Notification message
     * @param  string|null  $url  URL to navigate to when the notification is clicked
     * @param  array  $data  Additional data to include with the notification
     * @return void
     */
    public function notifyUser($users, string $type, string $title, string $message, ?string $url = null, array $data = []): void
    {
        try {
            // Ensure we have an array of users
            $users = is_array($users) ? $users : [$users];
            
            foreach ($users as $user) {
                if (!($user instanceof User)) {
                    Log::warning('Attempted to notify a non-User instance', [
                        'user' => $user,
                        'type' => $type,
                    ]);
                    continue;
                }

                $notificationData = array_merge($data, [
                    'id' => (string) \Illuminate\Support\Str::uuid(),
                    'type' => $type,
                    'title' => $title,
                    'message' => $message,
                    'url' => $url,
                    'notifiable_type' => get_class($this),
                    'notifiable_id' => $this->getKey(),
                    'created_at' => now()->toDateTimeString(),
                ]);

                // Dispatch the notification event
                event(new NewNotificationEvent($user, $notificationData));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send notification: ' . $e->getMessage(), [
                'exception' => $e,
                'type' => $type,
                'users' => $users,
            ]);
        }
    }

    /**
     * Send a notification to multiple users.
     *
     * @param  \Illuminate\Database\Eloquent\Collection|array  $users  Collection or array of users to notify
     * @param  string  $type  Type of notification
     * @param  string  $title  Notification title
     * @param  string  $message  Notification message
     * @param  string|null  $url  URL to navigate to when the notification is clicked
     * @param  array  $data  Additional data to include with the notification
     * @return void
     */
    public function notifyUsers($users, string $type, string $title, string $message, ?string $url = null, array $data = []): void
    {
        $this->notifyUser($users, $type, $title, $message, $url, $data);
    }
}
