import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppinglistDialogDeleteComponent } from './shoppinglist-dialog-delete.component';

describe('ShoppinglistDialogDeleteComponent', () => {
  let component: ShoppinglistDialogDeleteComponent;
  let fixture: ComponentFixture<ShoppinglistDialogDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppinglistDialogDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppinglistDialogDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
