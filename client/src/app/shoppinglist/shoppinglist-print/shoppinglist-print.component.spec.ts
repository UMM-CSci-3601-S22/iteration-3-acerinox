import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppinglistPrintComponent } from './shoppinglist-print.component';

describe('ShoppinglistPrintComponent', () => {
  let component: ShoppinglistPrintComponent;
  let fixture: ComponentFixture<ShoppinglistPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppinglistPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppinglistPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
