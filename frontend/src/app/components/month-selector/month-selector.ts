import { Component, input, output, computed } from "@angular/core";

@Component({
  selector: "app-month-selector",
  templateUrl: "./month-selector.html",
  styles: [],
})
export class MonthSelector {
  month = input.required<string>(); // "2026-04"
  monthChange = output<string>();

  displayMonth = computed(() => {
    const [year, m] = this.month().split("-");
    const date = new Date(Number(year), Number(m) - 1);
    return date.toLocaleDateString("sk-SK", { month: "long", year: "numeric" });
  });

  prev() {
    const [year, m] = this.month().split("-").map(Number);
    const date = new Date(year, m - 2);
    this.monthChange.emit(this.formatMonth(date));
  }

  next() {
    const [year, m] = this.month().split("-").map(Number);
    const date = new Date(year, m);
    this.monthChange.emit(this.formatMonth(date));
  }

  private formatMonth(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }
}
