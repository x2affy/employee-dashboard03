import { Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list.component';
import { UserDetailComponent } from './pages/user-detail.component';

export const routes: Routes = [
  { path: '', component: UserListComponent , pathMatch: 'full' },
  { path: 'employee/:id', component: UserDetailComponent },
];
