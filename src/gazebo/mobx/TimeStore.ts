import { addDays, endOfDay, formatISO, getISODay, startOfDay } from "date-fns";
import { makeAutoObservable } from "mobx";

export class TimeStore {
  public now: Date;
  private readonly intervalID: number;

  constructor() {
    this.now = new Date();
    // @ts-ignore
    this.intervalID = setInterval(this.updateNow, 1000) as number;

    makeAutoObservable(this);
  }

  public get isoDay(): number {
    return getISODay(this.now);
  }

  public get todayISO(): string {
    return formatISO(this.now, { representation: "date" });
  }

  public get monday(): Date {
    const now = new Date(); // Note we use now because we want to trigger only on isoDay recomputation
    return startOfDay(addDays(now, -this.isoDay + 1));
  }

  public get sunday(): Date {
    const now = new Date(); // Note we use now because we want to trigger only on isoDay recomputation
    return endOfDay(addDays(now, 7 - this.isoDay));
  }

  public dispose(): void {
    clearTimeout(this.intervalID);
  }

  private updateNow(): void {
    this.now = new Date();
  }
}

export const timeStore = new TimeStore();
