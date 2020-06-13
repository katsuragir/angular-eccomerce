import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';


export const rootRouterConfig: Routes = [

  {
    path: 'home/product/brand',
    redirectTo: 'pages/404',
    pathMatch: 'full'
  },
  {
    path : '',
    component : MainComponent,
    children: [
      {
        path : 'home',
        loadChildren: './shop/shop.module#ShopModule'
      },
      {
        path: 'pages',
        loadChildren: './pages/pages.module#PagesModule'
      },
      /*
      {
        path: 'blog',
        loadChildren: './blog/blog.module#BlogModule'
      }
      */
    ]
  },
  {
    path: '**',
    redirectTo: 'pages/404'
  },
  {
    path: 'assets',
    redirectTo: 'pages/404'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(rootRouterConfig)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

