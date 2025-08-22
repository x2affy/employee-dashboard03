import { Routes } from '@angular/router';
import { UserListComponent } from './user-list.component';
import { UserDetailComponent } from './user-detail.component';

export const routes: Routes = [
  { path: '', component: UserListComponent , pathMatch: 'full' },
  { path: 'employee/:id', component: UserDetailComponent },
];
