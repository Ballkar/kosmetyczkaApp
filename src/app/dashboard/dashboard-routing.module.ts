import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { DashboardResolver } from './dashboard.resolver';
import { HomepageComponent } from './homepage/homepage.component';


const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    resolve: { user: DashboardResolver },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        component: HomepageComponent,
      },
      {
        path: 'message',
        loadChildren : () => import('./message/message.module').then(m => m.MessageModule),
      },
      {
        path: 'customer',
        loadChildren : () => import('./customers/customers.module').then(m => m.CustomersModule),
      },
      {
        path: 'work',
        loadChildren : () => import('./schedule/schedule.module').then(m => m.ScheduleModule),
      },
      {
        path: 'profile',
        loadChildren : () => import('./user/user.module').then(m => m.UserModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
