import { Product } from 'src/app/products/product';

const testProductEditData = {
  _id: '6227c728fc13ae58600005d7',
  productName: 'Salami - Genova',
  description: 'Thin sliced meat',
  brand: 'Jacobson, Herman and Metz',
  category: 'produce',
  store: 'Willies',
  location: 'volutpat',
  notes: 'Slightly spicy',
  tags: [],
  lifespan: 0,
  threshold: 33,
  image: 'http://dummyimage.com/200x100.png/5fa2dd/ffffff'
} as Product;

export class ProductFormPage {

  navigateTo(mode: 'ADD' | 'EDIT', product?: Product) {
    if (mode === 'ADD') {
      return cy.visit('/products/new');
    }
    if (mode === 'EDIT' && product) {
      return cy.visit(`/products/edit/${product._id}`);
    }
  }

  getTitle(mode: 'ADD' | 'EDIT') {
    if (mode === 'ADD') {
      return cy.get('.add-product-title');
    }
    if (mode === 'EDIT') {
      return cy.get('.edit-product-title');
    }
  }

  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    return select.click().get(`mat-option[value="${value}"]`).click();
  }

  getFormField(fieldName: string) {
    return cy.get(`mat-form-field [formControlName=${fieldName}]`);
  }

  addProductButton() {
    return cy.get('[data-test="confirmProductButton"]');
  }

  addProduct(newProduct: Product) {
    this.getFormField('productName').type(newProduct.productName);
    this.getFormField('brand').type(newProduct.brand);
    this.getFormField('store').type(newProduct.store);
    this.selectMatSelectValue(cy.get('[formControlName=category]'), newProduct.category);

    if (newProduct.description) {
      this.getFormField('description').type(newProduct.description);
    }
    if (newProduct.lifespan) {
      this.getFormField('lifespan').clear();
      this.getFormField('lifespan').type(`${newProduct.lifespan}`);
    }
    if (newProduct.image) {
      this.getFormField('image').type(newProduct.image);
    }
    if (newProduct.location) {
      this.getFormField('location').type(newProduct.location);
    }
    if (newProduct.notes) {
      this.getFormField('notes').type(newProduct.notes);
    }
    if (newProduct.threshold) {
      this.getFormField('threshold').clear();
      this.getFormField('threshold').type(`${newProduct.threshold}`);
    }

    return this.addProductButton().click();
  }
}
