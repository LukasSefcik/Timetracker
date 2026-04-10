import { Component, inject, signal, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { Summary as SummaryModel } from "../../models/entry.model";
import { MonthSelector } from "../month-selector/month-selector";

@Component({
  selector: "app-summary",
  imports: [MonthSelector],
  templateUrl: "./summary.html",
  styles: [],
})
export class Summary implements OnInit {
  private api = inject(ApiService);

  currentMonth = signal(this.getCurrentMonth());
  summary = signal<SummaryModel>({ totalHours: 0, hourlyRate: 0, totalAmount: 0 });

  ngOnInit() {
    this.loadSummary();
  }

  onMonthChange(month: string) {
    this.currentMonth.set(month);
    this.loadSummary();
  }

  loadSummary() {
    this.api.getSummary(this.currentMonth()).subscribe((summary) => {
      this.summary.set(summary);
    });
  }

  private getCurrentMonth(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }
}
