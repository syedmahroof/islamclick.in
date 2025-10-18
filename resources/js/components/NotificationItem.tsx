import { FC } from 'react';
import { Bell, CheckCircle2, X, Clock, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  showActions?: boolean;
}

const getNotificationIcon = (type: string) => {
  const iconProps = { className: 'h-5 w-5' };
  
  if (type.includes('success')) {
    return <CheckCircle {...iconProps} className="text-green-500" />;
  }
  
  if (type.includes('error') || type.includes('failed')) {
    return <XCircle {...iconProps} className="text-red-500" />;
  }
  
  if (type.includes('warning')) {
    return <AlertCircle {...iconProps} className="text-yellow-500" />;
  }
  
  if (type.includes('info')) {
    return <Info {...iconProps} className="text-blue-500" />;
  }
  
  return <Bell {...iconProps} className="text-gray-500" />;
};

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDismiss,
  showActions = true,
}) => {
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDismiss) {
      onDismiss(notification.id);
    }
  };

  const content = (
    <div className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
      <div className="flex-shrink-0 mt-0.5">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {notification.title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {notification.message}
        </p>
        <div className="mt-1 flex items-center text-xs text-gray-400">
          <Clock className="h-3 w-3 mr-1" />
          <span>{notification.time_ago}</span>
        </div>
      </div>
      {showActions && (
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={handleMarkAsRead}
            className="text-gray-400 hover:text-blue-500 transition-colors"
            title="Mark as read"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );

  if (notification.url) {
    return (
      <Link
        href={notification.url}
        className="block hover:no-underline"
        onClick={handleMarkAsRead}
      >
        {content}
      </Link>
    );
  }

  return <div className="block">{content}</div>;
};

export default NotificationItem;
