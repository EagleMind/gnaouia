import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class homeComponent {
  isLoggedIn: boolean | null = null;
  userType: string | null = null;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.LoggedIn().subscribe((loggedIn: any) => {
      this.isLoggedIn = loggedIn ? true : false;
    });
  }
}
