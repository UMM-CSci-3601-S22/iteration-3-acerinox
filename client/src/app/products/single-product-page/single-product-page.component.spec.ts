import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from '../../../testing/activated-route-stub';
import { MockProductService } from 'src/testing/product.service.mock';
import { Product } from '../product';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductService } from '../product.service';
import { SingleProductPageComponent } from './single-product-page.component';

describe('SingleProductPageComponent', () => {
  let component: SingleProductPageComponent;
  let fixture: ComponentFixture<SingleProductPageComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule
      ],
      declarations: [ SingleProductPageComponent, ProductListComponent ],
      providers: [
        { provide: ProductService, useValue: new MockProductService() },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific product profile/page', () => {
    const expectedProduct: Product = MockProductService.testProducts[0];
    activatedRoute.setParamMap({ id: expectedProduct._id});

    expect(component.id).toEqual(expectedProduct._id);
    expect(component.product).toEqual(expectedProduct);
  });

  it('should navigate to the correct product when the id parameter changes', () => {
    let expectedProduct: Product = MockProductService.testProducts[0];
    activatedRoute.setParamMap({ id: expectedProduct._id});
    expect(component.id).toEqual(expectedProduct._id);

    expectedProduct = MockProductService.testProducts[1];
    activatedRoute.setParamMap({ id: expectedProduct._id});
    expect(component.id).toEqual(expectedProduct._id);
  });

  it('should have `null` for a product with a bad id', () => {
    activatedRoute.setParamMap({ id: 'badID' });

    expect(component.id).toEqual('badID');
    expect(component.product).toBeNull();
  });
});
