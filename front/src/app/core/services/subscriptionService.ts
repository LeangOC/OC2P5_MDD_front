import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
    public baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  isSubscribed(subjectId: number, userId: number = 1) {
       return this.http.get<boolean>(
      `${this.baseUrl}/subscription/${subjectId}/${userId}`
    );
  }

  subscribeToSubject(subjectId: number, userId: number) {
      return this.http.post(`${this.baseUrl}/subscription/subscribe`, {
      subjectId,
      userId,
    });
  }

  unsubscribeSubject(subjectId: number, userId: number) {
       return this.http.delete(
      `${this.baseUrl}/subscription/unsubscribe/${subjectId}/${userId}`
    );
  }
}
