import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRootRoutingModule } from './school-root-routing.module';

import { SchoolRootComponent } from './school-root.component';

import { AddPostComponent } from './add-post/add-post.component';
import { NewspaperComponent } from './newspaper/newspaper.component';
import { YourAccountComponent } from './your-account/your-account.component';
import { YourPostsComponent } from './your-posts/your-posts.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';


// Shared Module
import { SharedModule } from '../common/shared.module';

// CKEditor
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PostDetailsComponent } from './post-details/post-details.component';

@NgModule({
  declarations: [
    SchoolRootComponent,
    AddPostComponent,
    NewspaperComponent,
    YourAccountComponent,
    YourPostsComponent,
    PostDetailsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SchoolRootRoutingModule,
    MatSelectModule,
    SharedModule,
    CKEditorModule
  ]
})
export class SchoolRootModule { }
