export interface Entry {
  id: number;
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
