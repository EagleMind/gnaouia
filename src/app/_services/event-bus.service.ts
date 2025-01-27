import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private eventSubject = new BehaviorSubject<string>('');

  emit(event: string) {
    this.eventSubject.next(event);
  }

  get events$() {
    return this.eventSubject.asObservable();
  }
}
