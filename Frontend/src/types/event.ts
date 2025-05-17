export interface Event {
  id: string;
  title: string;
  description: string;
  startime: any;
  endtime: any;
  location: string;
  category: string;
  imageUrl?: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar: string;
  createdAt: string;
  participants: string[];
  maxParticipants: number | null;
  tags: string[];
} 