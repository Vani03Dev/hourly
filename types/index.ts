export interface Expert {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo: string;
  credentials: string[];
  rating: number;
  sessions: number;
  price: number;
  availability: string;
  location: string;
  responseTime: string;
  isOnline?: boolean;
  perMinuteRate?: number;
}

export interface Booking {
  id: string;
  expertId: string;
  expertName: string;
  expertPhoto: string;
  date: string;
  time: string;
  duration: string;
  type: "video" | "chat";
  price: number;
  status: "upcoming" | "completed" | "cancelled";
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  date: string;
  type: string;
  text: string;
  verified: boolean;
}
