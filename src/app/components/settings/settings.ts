import { Component, inject, signal, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-settings",
  imports: [FormsModule],
  templateUrl: "./settings.html",
  styles: [],
})
export class Settings implements OnInit {
  private api = inject(ApiService);

  hourlyRate = signal<number>(0);
  saved = signal(false);

  ngOnInit() {
    this.api.getSettings().subscribe((settings) => {
      this.hourlyRate.set(settings.hourlyRate);
    });
  }

  save() {
    this.api.updateSettings(this.hourlyRate()).subscribe(() => {
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 2000);
    });
  }
}
