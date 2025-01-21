import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './_services/auth.service';
import { initFlowbite } from 'flowbite';
import { SidebarComponent } from './pages/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isLoggedIn: boolean | null = null;
  userType: string | null = null;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    initFlowbite();
    this.authService.LoggedIn().subscribe((loggedIn: any) => {
      this.isLoggedIn = loggedIn ? true : false;
    });
  }
}
