import { Routes } from '@angular/router';
import { AuthGuard } from './security/guards/auth.guard';
import { NoAuthGuard } from './security/guards/no-auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { MerchandiseComponent } from './pages/merchandise/merchandise.component';
import { ArticleComponent } from './pages/articles/article.component';
import { ViewArticleDetailsComponent } from './pages/articles/view-article-details/view-article-details.component';
import {
  faNewspaper,
  faStore,
  faBullhorn,
} from '@fortawesome/free-solid-svg-icons';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: AnnouncementsComponent,
  },
  {
    path: 'announcements',
    canActivate: [AuthGuard],
    component: AnnouncementsComponent,
    data: { title: 'Announcements', icon: faBullhorn },
  },
  {
    path: 'merchandise',
    canActivate: [AuthGuard],
    component: MerchandiseComponent,
    data: { title: 'Merchandise', icon: faStore },
  },
  {
    path: 'articles',
    canActivate: [AuthGuard],
    component: ArticleComponent,
    data: { title: 'Articles', icon: faNewspaper },
  },
  {
    path: 'articles/details/:articleId', // Moved to a top-level route with the correct syntax
    canActivate: [AuthGuard],
    component: ViewArticleDetailsComponent,
  },
  {
    path: 'articles/create', // Moved to a top-level route with the correct syntax
    canActivate: [AuthGuard],
    component: ViewArticleDetailsComponent,
  },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },

  { path: '**', redirectTo: 'login' },
];
