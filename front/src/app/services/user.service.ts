import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private storageKey = 'users';

  constructor() {}

  getUsers(): User[] {
    const users = localStorage.getItem(this.storageKey);

    return users ? JSON.parse(users) : [];
  }

  saveUser(user: User): void {

    const users = this.getUsers();

    users.push(user);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(users)
    );
  }
  login(
    identifier: string,
    password: string
  ): User | null {

    const users = this.getUsers();

    const user = users.find(
      u =>
        (
          u.email === identifier ||
          u.username === identifier
        ) &&
        u.password === password
    );

    return user || null;
  }
}
