export interface Entry {
  id: string;
  date: string;
  hours: number;
}

export interface Summary {
  totalHours: number;
  hourlyRate: number;
  totalAmount: number;
}

export interface Settings {
  hourlyRate: number;
}
