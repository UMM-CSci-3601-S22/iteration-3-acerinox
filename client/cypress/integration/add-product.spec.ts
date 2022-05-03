import { ProductFormPage } from 'cypress/support/product-form.po';
import { Product } from 'src/app/products/product';

const testProductToAdd: Product = {
  _id: null,
  productName: 'Pineapple',
  brand: 'Hawaiian',
  category: 'produce',
  description: 'A pineapple',
  image: '',
  lifespan: 4,
  location: 'Florida',
  notes: 'A tropical fruit',
  store: 'Pom de Terre',
  tags: [],
  threshold: 4
};

describe('Add Product', () => {
  const page = new ProductFormPage();

  beforeEach(() => {
    page.navigateTo('ADD');
  });

  it('should have the correct title', () => {
    page.getTitle('ADD').should('have.text', 'Create a New Product');
  });

  it('should enable and disable the "ADD PRODUCT" button', () => {
    page.addProductButton().should('be.disabled');
    page.getFormField('productName').type('Apples');
    page.getFormField('brand').type('Minnesotan');
    page.getFormField('store').type('Willies');
    page.getFormField('location').type('Aisle 10');
    page.selectMatSelectValue(cy.get('[formControlName=category]'), 'produce');

    page.addProductButton().should('be.enabled');

    page.getFormField('productName').clear();
    page.addProductButton().should('be.disabled');
  });

  describe('Adding a new product', () => {
    it('should go to the right page, and have the right info', () => {
      page.addProduct(testProductToAdd);

    cy.url()
      .should('match', /\/products\/[0-9a-fA-F]{24}$/)
      .should('not.match', /\/products\/new$/);

    // The new product should have all of the entered data
    cy.get('.product-card-name').should('have.text', testProductToAdd.productName);
    cy.get('.product-card-brand').should('have.text', testProductToAdd.brand);
    cy.get('.product-card-store').should('have.text', testProductToAdd.store);
    cy.get('.product-card-location').should('have.text', testProductToAdd.location);
    cy.get('.product-card-category').should('have.text', testProductToAdd.category);
    cy.get('.product-card-description').should('have.text', testProductToAdd.description);
    cy.get('.product-card-notes').should('have.text', testProductToAdd.notes);
    cy.get('.product-card-lifespan').should('have.text', testProductToAdd.lifespan);
    cy.get('.product-card-threshold').should('have.text', testProductToAdd.threshold);
    });
  });
});
