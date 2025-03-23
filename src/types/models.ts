export interface Person {
  id: string;
  name: string;
  relationship: 'friend' | 'partner' | 'family';
  imageUri: string;
  nfcTagId: string | null;
  meetCount: number;
  lastMeetDate: string | null;
  title: string;
  notes: string;
  memories: Memory[];
}

export interface Memory {
  id: string;
  type: 'youtube' | 'spotify' | 'photo' | 'note';
  content: string;
  createdAt: string;
}
