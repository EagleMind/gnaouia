import { Component, Input, OnInit } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from '../../../app.routes';
import { AuthService } from '../../../_services/auth.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    imports: [CommonModule, RouterModule],
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  routes: any = [];
  isOpen = false;
  isLoggedIn = false;
  constructor(private AuthService: AuthService) {}
  ngOnInit(): void {
    this.routes = this.getRoutes();
    if (this.AuthService.isLoggedIn.value) {
      this.isLoggedIn = true;
    }
  }
  getRoutes() {
    return routes.filter((route) => route?.data?.['title']); // Returns only routes with a title
  }
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
