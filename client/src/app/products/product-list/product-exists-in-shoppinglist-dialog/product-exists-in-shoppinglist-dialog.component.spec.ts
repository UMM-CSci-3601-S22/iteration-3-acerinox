import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductExistsInShoppinglistDialogComponent } from './product-exists-in-shoppinglist-dialog.component';

describe('ProductExistsInShoppinglistDialogComponent', () => {
  let component: ProductExistsInShoppinglistDialogComponent;
  let fixture: ComponentFixture<ProductExistsInShoppinglistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductExistsInShoppinglistDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductExistsInShoppinglistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
