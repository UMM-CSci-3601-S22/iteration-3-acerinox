import { Product } from 'src/app/products/product';
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

  editProductButton() {
    return cy.get('[data-test="confirmProductButton"]');
  }

  addProduct(productData: Product) {
    this.fillInFormData(productData);
    return this.editProductButton().click();
  }

  editProduct(productData: Product) {
    this.fillInFormData(productData);
    return this.editProductButton().click();
  }

  private fillInFormData(productData: Product) {
    this.getFormField('productName').clear();
    this.getFormField('productName').type(productData.productName);
    this.getFormField('brand').clear();
    this.getFormField('brand').type(productData.brand);
    this.getFormField('store').clear();
    this.getFormField('store').type(productData.store);
    this.selectMatSelectValue(cy.get('[formControlName=category]'), productData.category);

    if (productData.description) {
      this.getFormField('description').clear();
      this.getFormField('description').type(productData.description);
    }
    if (productData.lifespan) {
      this.getFormField('lifespan').clear();
      this.getFormField('lifespan').type(`${productData.lifespan}`);
    }
    if (productData.image) {
      this.getFormField('image').clear();
      this.getFormField('image').type(productData.image);
    }
    if (productData.location) {
      this.getFormField('location').clear();
      this.getFormField('location').type(productData.location);
    }
    if (productData.notes) {
      this.getFormField('notes').clear();
      this.getFormField('notes').type(productData.notes);
    }
    if (productData.threshold) {
      this.getFormField('threshold').clear();
      this.getFormField('threshold').type(`${productData.threshold}`);
    }

  }
}
