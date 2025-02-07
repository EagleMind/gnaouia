import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './_services/auth.service';
import { initFlowbite } from 'flowbite';
import { SidebarComponent } from './pages/sharedComponents/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ModuleRegistry,
  provideGlobalGridOptions,
} from 'ag-grid-community';
import { provideAnimations } from '@angular/platform-browser/animations';
ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: 'legacy' });

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule, AgGridModule],
  providers: [provideAnimations()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isLoggedIn: boolean | null = null;
  userType: string | null = null;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    initFlowbite();
    const test = this.authService.hasTokenAndValid();
    if (!test) {
      this.authService.logout();
    }
    this.authService.LoggedIn().subscribe((loggedIn: any) => {
      this.isLoggedIn = loggedIn ? true : false;
    });
  }
}
