import { ProductListPage } from '../support/product-list.po';

const page = new ProductListPage();

describe('Product List', () => {

  beforeEach(() => {
    page.navigateTo();
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

});
