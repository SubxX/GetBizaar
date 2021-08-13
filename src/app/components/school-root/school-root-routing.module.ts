import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchoolRootComponent } from './school-root.component';

import { AddPostComponent } from './add-post/add-post.component';
import { NewspaperComponent } from './newspaper/newspaper.component';
import { YourAccountComponent } from './your-account/your-account.component';
import { YourPostsComponent } from './your-posts/your-posts.component';
import { PostDetailsComponent } from './post-details/post-details.component';

const routes: Routes = [
  {
    path: '', component: SchoolRootComponent, children: [
      { path: 'newspaper', component: NewspaperComponent },
      { path: 'create-article', component: AddPostComponent },
      { path: 'my-articles', component: YourPostsComponent },
      { path: 'my-profille', component: YourAccountComponent },
      { path: 'article/:id', component: PostDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRootRoutingModule { }
