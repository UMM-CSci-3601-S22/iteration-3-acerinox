/* eslint-disable max-len */
import { ProductFormPage } from 'cypress/support/product-form.po';
import { Product } from 'src/app/products/product';

const testProductToEdit: Product = {
  _id: '624f7cbcfc13ae732800008c',
  productName: 'Salmon - Canned',
  description: 'In congue. Etiam justo. Etiam pretium iaculis justo.In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.',
  brand: 'Schmidt Group',
  category: 'produce',
  store: 'RealFoodHub',
  location: 'Aisle 92',
  notes: 'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.',
  tags: [],
  lifespan: 879,
  threshold: 41,
  image: 'https://creinkmun.cn/UMM-SP22-CSCI3601-Product-Temp-Pic.png'
};

const testProductEditData: Product = {
  _id: '6227c728fc13ae58600005d7',
  productName: 'Salmon - Canned',
  description: 'In congue. Etiam justo. Etiam pretium iaculis justo.In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.',
  brand: 'Jacobson, Herman and Metz',
  category: 'produce',
  store: 'Willies',
  location: 'volutpat',
  notes: 'Slightly spicy',
  tags: [],
  lifespan: 879,
  threshold: 33,
  image: 'https://creinkmun.cn/UMM-SP22-CSCI3601-Product-Temp-Pic.png'
};

describe('Edit Product', () => {
  const page = new ProductFormPage();

  beforeEach(() => {
    cy.task('seed:database');
    page.navigateTo('EDIT', testProductToEdit);
    cy.wait(2000);
  });

  it('should have the correct title', () => {
    page.getTitle('EDIT').should('have.text', 'Edit a Product');
  });

  it('should load in the data from the existing product', () => {
    page.editProductButton().should('be.enabled');
    page.getFormField('productName').should('have.value', testProductToEdit.productName);
    page.getFormField('brand').should('have.value', testProductToEdit.brand);
    page.getFormField('store').should('have.value', testProductToEdit.store);
    page.selectMatSelectValue(cy.get('[formControlName=category]'), testProductToEdit.category);
    cy.wait(1000);
    page.getFormField('description').should('have.value', testProductToEdit.description);
    page.getFormField('lifespan').should('have.value', `${testProductToEdit.lifespan}`);
    page.getFormField('location').should('have.value', testProductToEdit.location);
    page.getFormField('notes').should('have.value', testProductToEdit.notes);
    page.getFormField('threshold').should('have.value', `${testProductToEdit.threshold}`);
  });

  it('should do the stuff when the new product is valid.', () => {
    //Add the edited product to the form
    page.editProduct(testProductEditData);

    cy.url()
      .should('match', /\/products\/[0-9a-fA-F]{24}$/)
      .should('not.match', /\/products\/new$/);

    // The new product should have all of the entered data
    cy.get('.product-card-name').should('have.text', testProductEditData.productName);
    cy.get('.product-card-brand').should('have.text', testProductEditData.brand);
    cy.get('.product-card-store').should('have.text', testProductEditData.store);
    cy.get('.product-card-location').should('have.text', testProductEditData.location);
    cy.get('.product-card-category').should('have.text', testProductEditData.category);
    cy.get('.product-card-description').should('have.text', testProductEditData.description);
    cy.get('.product-card-notes').should('have.text', testProductEditData.notes);
    cy.get('.product-card-threshold').should('have.text', testProductEditData.threshold);

  });

});
