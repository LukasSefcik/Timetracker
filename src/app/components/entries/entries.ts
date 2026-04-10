import { Component, inject, signal, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../services/api.service";
import { Entry } from "../../models/entry.model";
import { MonthSelector } from "../month-selector/month-selector";

@Component({
  selector: "app-entries",
  imports: [FormsModule, MonthSelector, DatePipe],
  templateUrl: "./entries.html",
  styles: [],
})
export class Entries implements OnInit {
  private api = inject(ApiService);

  entries = signal<Entry[]>([]);
  currentMonth = signal(this.getCurrentMonth());

  newDate = signal(this.today());
  newHours = signal<number | null>(null);

  editingId = signal<string | null>(null);
  editDate = signal("");
  editHours = signal<number | null>(null);

  ngOnInit() {
    this.loadEntries();
  }

  onMonthChange(month: string) {
    this.currentMonth.set(month);
    this.loadEntries();
  }

  loadEntries() {
    this.api.getEntries(this.currentMonth()).subscribe((entries) => {
      this.entries.set(entries);
    });
  }

  addEntry() {
    if (!this.newHours()) return;
    this.api
      .createEntry(this.newDate(), this.newHours()!)
      .subscribe(() => {
        this.newHours.set(null);
        this.newDate.set(this.today());
        this.loadEntries();
      });
  }

  startEdit(entry: Entry) {
    this.editingId.set(entry.id);
    this.editDate.set(entry.date);
    this.editHours.set(entry.hours);
  }

  saveEdit() {
    if (!this.editingId() || !this.editHours()) return;
    this.api
      .updateEntry(this.editingId()!, this.editDate(), this.editHours()!)
      .subscribe(() => {
        this.editingId.set(null);
        this.loadEntries();
      });
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  deleteEntry(id: string) {
    this.api.deleteEntry(id).subscribe(() => {
      this.loadEntries();
    });
  }

  private getCurrentMonth(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
