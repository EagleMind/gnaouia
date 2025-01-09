import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from '../../home/home-routing.module';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  routes: any = [];
  isOpen = false;
  constructor() {}

  ngOnInit(): void {
    this.routes = this.getRoutes();
  }
  getRoutes() {
    for (const route of routes) {
      if (route.children) {
        this.routes.push(...route.children);
      }
    }

    return this.routes;
  }
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
