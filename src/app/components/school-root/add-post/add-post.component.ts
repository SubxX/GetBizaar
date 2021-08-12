import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { MainService } from '../../../services/main.service';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit, OnDestroy {
  articleForm: FormGroup;

  destroy: Subject<any> = new Subject();
  type = 'add';
  articleImageSrc: string;
  public Editor = ClassicEditor;
  categoryList = [
    { title: 'Sports', id: 'xxx-txz' },
    { title: 'Politics', id: 'xza-sta' },
    { title: 'Opinion', id: 'zmj-ham' },
    { title: 'Fiction', id: 'lao-pyu' },
    { title: 'History', id: 'loa-klm' }
  ]
  // @HostListener('window:beforeunload', ['$event'])
  // handeleScroll(e: any) {
  //     e.preventDefault();
  //     return e.returnValue = 'Are you sure ?';
  // }

  constructor(private fb: FormBuilder, private main: MainService, private router: Router) {
    this.initForm();
  }

  ngOnInit(): void {
    this.main.updateTitle('Create Article');
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  initForm(): void {
    this.articleForm = this.fb.group({
      image: [null, Validators.required],
      title: ['', Validators.required],
      category: ['', Validators.required],
      body: ['', [Validators.required]]
    })
  }

  submitForm(): void {
    if (this.articleForm.invalid) {
      for (let key in this.articleForm.controls) {
        this.articleForm.controls[key].markAsDirty();
      }
      return;
    }

    console.log(this.articleForm.value);
  }

  fileSelected(e): void {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (r: any) => {
        this.articleForm.patchValue({ image: file });
        this.articleImageSrc = r.target.result;
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  }

  selectCategory(cat): void {
    this.articleForm.patchValue({ category: cat });
  }

  getError(control: AbstractControl) {
    return control.dirty && control.errors;
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.subscribe();
  }

}
