import { router } from '@inertiajs/react';

export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    data?: Record<string, any>;
}

class NotificationService {
    private static instance: NotificationService;
    private notifications: Notification[] = [];
    private unreadCount = 0;
    private listeners: (() => void)[] = [];

    private constructor() {
        this.loadNotifications();
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    public async loadNotifications() {
        try {
            const response = await fetch('/api/notifications');
            if (response.ok) {
                const data = await response.json();
                this.notifications = data.notifications || [];
                this.updateUnreadCount();
                this.notifyListeners();
            }
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    }

    public getNotifications(): Notification[] {
        return [...this.notifications];
    }

    public getUnreadCount(): number {
        return this.unreadCount;
    }

    public async markAsRead(id: string) {
        try {
            const response = await fetch(`/api/notifications/${id}/read`, {
                method: 'POST',
            });

            if (response.ok) {
                const notification = this.notifications.find(n => n.id === id);
                if (notification && !notification.read) {
                    notification.read = true;
                    this.updateUnreadCount();
                    this.notifyListeners();
                }
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }

    public async markAllAsRead() {
        try {
            const response = await fetch('/api/notifications/read-all', {
                method: 'POST',
            });

            if (response.ok) {
                this.notifications.forEach(notification => {
                    notification.read = true;
                });
                this.updateUnreadCount();
                this.notifyListeners();
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    }

    public async dismiss(id: string) {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                this.notifications = this.notifications.filter(n => n.id !== id);
                this.updateUnreadCount();
                this.notifyListeners();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to dismiss notification:', error);
        }
    }

    public addListener(callback: () => void) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    private updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener());
    }
}

export const notificationService = NotificationService.getInstance();
