"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

type NotificationsContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Ask for browser notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotifications([]);
      return;
    }

    let isMounted = true;
    let subscription: any = null;

    const fetchNotifications = async () => {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
        
      if (!error && data && isMounted) {
        setNotifications(data);
      }

      // Subscribe to real-time events
      subscription = supabase
        .channel('public:notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newNotif = payload.new as Notification;
            
            // 1. Update React state
            setNotifications((prev) => [newNotif, ...prev]);
            
            // 2. Show in-app Toast
            toast.success(`${newNotif.title}: ${newNotif.message}`, { duration: 5000, icon: '🔔' });
            
            // 3. Show native Browser Push Notification if tab is in background
            if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
              if (document.hidden) {
                new Notification(newNotif.title, {
                  body: newNotif.message,
                  icon: '/favicon.ico',
                });
              }
            }
          }
        )
        .subscribe();
    };

    fetchNotifications();

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    const { createClient } = await import('@/utils/supabase/client');
    const supabase = createClient();
    
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
  };

  const markAllAsRead = async () => {
    if (!user) return;
    const { createClient } = await import('@/utils/supabase/client');
    const supabase = createClient();
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};
