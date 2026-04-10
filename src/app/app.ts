import { Component, signal } from "@angular/core";
import { Entries } from "./components/entries/entries";
import { Summary } from "./components/summary/summary";
import { Settings } from "./components/settings/settings";

@Component({
  selector: "app-root",
  imports: [Entries, Summary, Settings],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  activeTab = signal<"entries" | "summary" | "settings">("entries");

  tabs = [
    { key: "entries" as const, label: "Záznamy", icon: "☰" },
    { key: "summary" as const, label: "Prehľad", icon: "◎" },
    { key: "settings" as const, label: "Nastavenia", icon: "⚙" },
  ];
}
