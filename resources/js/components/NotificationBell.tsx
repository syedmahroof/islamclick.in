import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock data - replace with real data from your notification service
  const notifications: Notification[] = [];
  const unreadCount = 3; // Temporary: Set to 3 for testing visibility
  
  useEffect(() => {
    console.log('NotificationBell mounted');
    return () => console.log('NotificationBell unmounted');
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          'relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none',
          'flex items-center justify-center h-9 w-9 rounded-full',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          'dark:text-gray-300 dark:hover:text-white',
          'border border-transparent hover:border-gray-300 dark:hover:border-gray-600',
          'transition-colors duration-200',
          'ring-2 ring-transparent focus:ring-2 focus:ring-primary/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          'active:scale-95',
          'overflow-visible' // Ensure badge is not clipped
        )}
        onClick={() => {
          console.log('Notification bell clicked');
          setIsOpen(!isOpen);
        }}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"
            style={{
              boxShadow: '0 0 0 2px hsl(var(--background))',
              zIndex: 10
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-white/10 z-50">
          <div className="p-2">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle mark all as read
                  }}
                >
                  Mark all as read
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                        !notification.read_at ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => {
                        // Handle notification click
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-start">
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {notification.time_ago}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No new notifications
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
