import { ProductListPage } from '../support/product-list.po';

const page = new ProductListPage();


// "Top Half" of Product List
describe('Product List', () => {

  beforeEach(() => {
    page.navigateTo();
    cy.wait(2000);
  });

  it('Should have the correct title', () => {
    page.getProductListTitle().should('have.text', 'Products');
  });

  it('Should type something in the Product Name filter and check that it returned correct elements', () => {
    // Filter for product 'Muffin'
    cy.get('#product-name-input').type('Muffin');

    // All of the product list items should have the name we are filtering by
    page.getFilteredProductListItems().each($item => {
      cy.wrap($item).find('.product-item-name').should('contain.text', 'Muffin');
    });
  });

  it('Should type something in the Brand filter and check that it returned correct elements', () => {
    // Filter for product 'Weimann'
    cy.get('#product-brand-input').type('Weimann');

    // All of the product list items should have the name we are filtering by
    page.getFilteredProductListItems().each($item => {
      cy.wrap($item).find('.product-item-brand').should('contain.text', 'Weimann');
    });
  });

  it('Should select a store and check that it returned correct elements', () => {

    // Filter for store 'Willies');
    page.selectStore('Willies');

    //further limit so cypress test doesn't stall out reading 100+ products
    page.selectCategory('bakery');

    // Some of the products should be listed
    page.getFilteredProductListItems().should('exist');

    // All of the product list items that show should have the store we are looking for
    page.getFilteredProductListItems().each($product => {
      cy.wrap($product).find('.product-item-store').should('have.text', ' Willies ');
    });
  });

  it('Should select a category and check that it returned correct elements', () => {

    // Filter for category 'canned goods');
    page.selectCategory('canned goods');

    // Some of the products should be listed
    page.getFilteredProductListItems().should('exist');

    // All of the product list items that show should have the store we are looking for
    page.getFilteredProductListItems().each($product => {
      cy.wrap($product).find('.product-item-category').should('have.text', ' canned goods ');
    });
  });

  it('Should click add product and go to the right URL', () => {
    page.addProductButton().click();

    // The URL should end with '/products/new'
    cy.url().should(url => expect(url.endsWith('/products/new')).to.be.true);
  });

});

// "Bottom Half" of Product List
describe('Product List Expansion Panels', () => {

  beforeEach(() => {
    page.navigateTo();
    cy.wait(1000);
  });

  it('Should check that expansion panels have the correct titles and items by categories', () => {

    page.getExpansionTitleByCategory('bakery').should('have.text', ' bakery ');

    page.getExpansionItemsByCategory('bakery').each($product => {
      cy.wrap($product).find('.product-item-category').should('have.text', ' bakery ');
    });

    page.getExpansionTitleByCategory('miscellaneous').should('have.text', ' miscellaneous ');

    page.getExpansionItemsByCategory('miscellaneous').each($product => {
      cy.wrap($product).find('.product-item-category').should('have.text', ' miscellaneous ');
    });
  });

});

// Delete products in Product List
describe('Delete button on Products From Product List', () => {

  beforeEach(() => {
    page.navigateTo();
    cy.wait(1000);
  });

  it('Should the delete button for the first product from the filtered list and read the dialog popup', () => {

    // Filter products
    page.selectCategory('general grocery');
    cy.get('#product-name-input').type('Coffee');

    // Check that 'Coffee - Cafe Moreno' is the first product
    page.getFilteredProductListItems().first().within(($product) => {
      cy.wrap($product).find('.product-item-name').should('contain.text', ' Coffee - Cafe Moreno ');
    });

    // Grab and delete first one, 'Coffee - Cafe Moreno'
    page.clickDeleteButton();
    cy.get('.mat-dialog-content')
    .should('contain.text', 'Are you sure you want to delete Coffee - Cafe Moreno? This action cannot be undone');
  });

  // Cypress having trouble finding expansion panels
  it('Should go to a product in an expansion tab and delete', () => {
    // Filter products
    page.selectCategory('seasonal');

    // Check that 'Beef - Ground Lean Fresh' is the first product
    page.getExpansionItemsByCategory('seasonal').first().within(($product) => {
      cy.wrap($product).find('.product-item-name').should('contain.text', ' Beef - Ground Lean Fresh ');
    });

    // Grab and click the delete button for the first one, 'Beef - Ground Lean Fresh'
    page.clickExpansionDeleteButton('seasonal');
    cy.get('.mat-dialog-content')
    .should('contain.text', 'Are you sure you want to delete Beef - Ground Lean Fresh? This action cannot be undone');
  });

});
