import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TitleCasePipe } from '@angular/common';

import { DialogDeleteComponent } from './dialog-delete.component';

describe('DialogDeleteComponent', () => {
  let component: DialogDeleteComponent;
  let fixture: ComponentFixture<DialogDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDeleteComponent ],
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
