import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Entry, Summary, Settings } from "../models/entry.model";

@Injectable({ providedIn: "root" })
export class ApiService {
  private http = inject(HttpClient);

  getEntries(month: string) {
    return this.http.get<Entry[]>(`/api/entries`, { params: { month } });
  }

  createEntry(date: string, hours: number) {
    return this.http.post<Entry>(`/api/entries`, { date, hours });
  }

  updateEntry(id: number, date: string, hours: number) {
    return this.http.put<Entry>(`/api/entries/${id}`, { date, hours });
  }

  deleteEntry(id: number) {
    return this.http.delete(`/api/entries/${id}`);
  }

  getSummary(month: string) {
    return this.http.get<Summary>(`/api/summary`, { params: { month } });
  }

  getSettings() {
    return this.http.get<Settings>(`/api/settings`);
  }

  updateSettings(hourlyRate: number) {
    return this.http.put<Settings>(`/api/settings`, { hourlyRate });
  }
}
