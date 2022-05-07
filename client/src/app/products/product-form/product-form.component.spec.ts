/* eslint-disable max-len */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductFormComponent } from './product-form.component';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProductService } from 'src/testing/product.service.mock';
import { ProductService } from '../product.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';

describe('ProductFormComponent', () => {

  let productService: ProductService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let snackBar: MatSnackBar;
  let router: Router;
  let activatedRoute: ActivatedRouteStub;

  let productFormComponent: ProductFormComponent;
  let productForm: FormGroup;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterModule
      ],
      declarations: [ProductFormComponent],
      providers: [
        { provide: ProductService, useValue: new MockProductService() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
      ]
    })
      .compileComponents().catch(error => {
        expect(error).toBeNull();
      });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    productService = TestBed.inject(ProductService);
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute) as unknown as ActivatedRouteStub;
  });

  afterEach(() => {
    //After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('The component under "EDIT" mode', () => {
    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(ProductFormComponent);
      productFormComponent = fixture.componentInstance;

      // Set the inputs to the component.
      productFormComponent.mode = 'EDIT';
      activatedRoute.setParamMap({
        id: MockProductService.testProducts[0]._id
      });

      productFormComponent.ngOnInit();
      fixture.detectChanges();
      productForm = productFormComponent.productForm;
      expect(productForm).toBeDefined();
      expect(productForm.controls).toBeDefined();
    }));

    it('should initialize a product from parameter', () => {
      expect(productFormComponent.product).toBeTruthy();
    });

    it('should make a call to productService.editProduct() when mode is "EDIT"', waitForAsync(() => {
      productFormComponent.id = MockProductService.testProducts[0]._id;
      const editSpy = spyOn(productService, 'editProduct').and.callThrough();
      const openSnackbarSpy = spyOn(snackBar, 'open');
      const navigateSpy = spyOn(router, 'navigate');

      productFormComponent.submitForm().then(() => {
        expect(editSpy).toHaveBeenCalledTimes(1);
        expect(editSpy).toHaveBeenCalledWith(productFormComponent.id, productForm.value);

        expect(openSnackbarSpy).toHaveBeenCalledTimes(1);
        expect(openSnackbarSpy.calls.mostRecent().args[0].startsWith(ProductFormComponent.editMessageSuccess)).toBeTrue();

        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy.calls.mostRecent().args[0][0].startsWith('/products/')).toBeTrue();
      });

    }));


  });
});
