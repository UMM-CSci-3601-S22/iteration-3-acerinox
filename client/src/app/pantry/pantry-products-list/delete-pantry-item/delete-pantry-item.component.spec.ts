import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePantryItemComponent } from './delete-pantry-item.component';

describe('DeletePantryItemComponent', () => {
  let component: DeletePantryItemComponent;
  let fixture: ComponentFixture<DeletePantryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePantryItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePantryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
