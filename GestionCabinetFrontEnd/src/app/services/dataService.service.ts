import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  private refreshSubject = new BehaviorSubject<boolean>(false);
  refreshRequested = this.refreshSubject.asObservable();

  requestRefresh() {
    this.refreshSubject.next(true);
  }


}
