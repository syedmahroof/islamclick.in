import { FC, useEffect, useState } from 'react';
import { Bell, CheckCircle, X, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Notification } from '@/types';
import NotificationItem from './NotificationItem';

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDismiss?: (id: string) => void;
  onDismissAll?: () => void;
  onViewAll?: () => void;
  isLoading?: boolean;
  className?: string;
}

const NotificationDropdown: FC<NotificationDropdownProps> = ({
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onDismissAll,
  onViewAll,
  isLoading = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-dropdown')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAllAsRead = async () => {
    if (onMarkAllAsRead) {
      setIsProcessing(true);
      try {
        await onMarkAllAsRead();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDismissAll = async () => {
    if (onDismissAll) {
      setIsProcessing(true);
      try {
        await onDismissAll();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (onMarkAsRead && !notification.read_at) {
      onMarkAsRead(notification.id);
    }
    
    if (notification.url) {
      router.visit(notification.url);
    }
    
    setIsOpen(false);
  };

  return (
    <div className={`relative notification-dropdown ${className}`}>
      <button
        type="button"
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Notifications
              </h3>
              <div className="flex space-x-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      disabled={isProcessing || unreadCount === 0}
                      className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Mark all as read"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Mark all read'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleDismissAll}
                      disabled={isProcessing}
                      className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Dismiss all"
                    >
                      Dismiss all
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={onMarkAsRead}
                      onDismiss={onDismiss}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && onViewAll && (
            <div className="p-2 bg-gray-50 dark:bg-gray-700 text-center border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => {
                  onViewAll();
                  setIsOpen(false);
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
