import { Injectable } from "@angular/core";
import { Observable, from, map } from "rxjs";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { Entry, Summary, Settings } from "../models/entry.model";

@Injectable({ providedIn: "root" })
export class ApiService {
  private entriesRef = collection(db, "entries");

  getEntries(month: string): Observable<Entry[]> {
    const startDate = `${month}-01`;
    const endDate = `${month}-32`;
    const q = query(
      this.entriesRef,
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date", "desc")
    );
    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Entry))
      )
    );
  }

  createEntry(date: string, hours: number): Observable<Entry> {
    return from(addDoc(this.entriesRef, { date, hours })).pipe(
      map((docRef) => ({ id: docRef.id, date, hours }))
    );
  }

  updateEntry(id: string, date: string, hours: number): Observable<Entry> {
    const docRef = doc(db, "entries", id);
    return from(updateDoc(docRef, { date, hours })).pipe(
      map(() => ({ id, date, hours }))
    );
  }

  deleteEntry(id: string): Observable<void> {
    const docRef = doc(db, "entries", id);
    return from(deleteDoc(docRef));
  }

  getSummary(month: string): Observable<Summary> {
    const startDate = `${month}-01`;
    const endDate = `${month}-32`;
    const q = query(
      this.entriesRef,
      where("date", ">=", startDate),
      where("date", "<=", endDate)
    );
    return from(
      Promise.all([getDocs(q), getDoc(doc(db, "settings", "config"))])
    ).pipe(
      map(([entriesSnap, settingsSnap]) => {
        const totalHours = entriesSnap.docs.reduce(
          (sum, d) => sum + (d.data()["hours"] as number),
          0
        );
        const hourlyRate = settingsSnap.exists()
          ? (settingsSnap.data()["hourlyRate"] as number)
          : 0;
        return { totalHours, hourlyRate, totalAmount: totalHours * hourlyRate };
      })
    );
  }

  getSettings(): Observable<Settings> {
    const docRef = doc(db, "settings", "config");
    return from(getDoc(docRef)).pipe(
      map((snap) =>
        snap.exists() ? (snap.data() as Settings) : { hourlyRate: 0 }
      )
    );
  }

  updateSettings(hourlyRate: number): Observable<Settings> {
    const docRef = doc(db, "settings", "config");
    return from(setDoc(docRef, { hourlyRate })).pipe(
      map(() => ({ hourlyRate }))
    );
  }
}
