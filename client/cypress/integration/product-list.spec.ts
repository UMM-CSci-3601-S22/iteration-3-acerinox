import { ProductListPage } from '../support/product-list.po';

const page = new ProductListPage();


// "Top Half" of Product List
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
      cy.wrap($item).find('.product-list-name').should('contain.text', 'Muffin');
    });
  });

  it('Should type something in the Brand filter and check that it returned correct elements', () => {
    // Filter for product 'Weimann'
    cy.get('#product-brand-input').type('Renner');

    // All of the product list items should have the name we are filtering by
    cy.get('body').find('.conditional-product-list').next().get('.filtered-product-list-item')
      .each($item => {
        cy.wrap($item).get('.product-list-brand').should('contain.text', 'Renner');
      });
  });

  it('Should select a store and check that it returned correct elements', () => {

    // Filter for store 'Willies');
    page.selectStore('Willies');

    //further limit so cypress test doesn't stall out reading 100+ products
    page.selectCategory('baked goods');

    // Some of the products should be listed
    page.getFilteredProductListItems().should('exist');

    // All of the product list items that show should have the store we are looking for
    page.getFilteredProductListItems().each($product => {
      cy.wrap($product).find('.product-list-store').should('have.text', ' Willies ');
    });
  });

  it('Should select a category and check that it returned correct elements', () => {

    // Filter for category 'miscellaneous');
    page.selectCategory('miscellaneous');

    // Some of the products should be listed
    page.getFilteredProductListItems().should('exist');

    // All of the product list items that show should have the store we are looking for
    page.getFilteredProductListItems().each($product => {
      cy.wrap($product).should('contain.text', ' Miscellaneous ');
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

    page.getExpansionTitleByCategory('baked goods').should('have.text', ' Baked Goods ');

    page.getExpansionItemsByCategory('baked goods').each($product => {
      cy.wrap($product).find('.product-list-category').should('have.text', ' Baked Goods ');
    });

    page.getExpansionTitleByCategory('miscellaneous').should('have.text', ' Miscellaneous ');

    page.getExpansionItemsByCategory('miscellaneous').each($product => {
      cy.wrap($product).find('.product-list-category').should('have.text', ' Miscellaneous ');
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
    page.selectCategory('frozen foods');
    cy.get('#product-name-input').type('Kahlua');

    // Check that 'Coffee - Cafe Moreno' is the first product
    page.getFilteredProductListItems().first().within(($product) => {
      cy.wrap($product).find('.product-list-name').should('contain.text', ' Kahlua ');
    });

    // Grab and delete first one, 'Kahlua'
    page.clickDeleteButton();
    cy.get('.mat-dialog-content')
      .should('contain.text', 'Remove Kahlua from your products?Note: This action cannot be undone');
  });

  it('Should go to a product in an expansion tab and read the dialog', () => {

    // Grab and click the delete button for the first one, 'Aspic - Light'
    page.clickExpansionDeleteButton('dairy');
    cy.get('.mat-dialog-content')
      .should('contain.text', 'Remove Aspic - Light from your products?Note: This action cannot be undone');
  });
});

// Add products to Pantry List
describe('Add button on Products to Pantry List', () => {

  beforeEach(() => {
    page.navigateTo();
    cy.wait(1000);
  });

  it('Should click the add to pantry button for the first product from the filtered list and read the dialog popup', () => {

    // Filter products
    page.selectCategory('frozen foods');
    cy.get('#product-name-input').type('Kahlua');

    // Check that 'Kahlua' is the first product
    page.getFilteredProductListItems().first().within(($product) => {
      cy.wrap($product).find('.product-list-name').should('contain.text', ' Kahlua ');
    });

    // Grab and delete first one, 'Kahlua'
    page.clickAddButton();
    cy.get('.mat-dialog-title')
      .should('contain.text', 'Add Kahlua to your Pantry');
  });

  it('Should click the add to shoppinglist button for the first product from the filtered list and read the dialog popup', () => {

    // Filter products
    page.selectCategory('frozen foods');
    cy.get('#product-name-input').type('Kahlua');

    // Check that 'Kahlua' is the first product
    page.getFilteredProductListItems().first().within(($product) => {
      cy.wrap($product).find('.product-list-name').should('contain.text', ' Kahlua ');
    });

    // Grab and delete first one, 'Kahlua'
    page.clickAddShoppingButton();
    cy.get('.mat-dialog-title')
      .should('contain.text', 'Add Kahlua to your Shopping List');
  });

  it('Should go to a product in an expansion tab, click add to pantry, and read the dialog', () => {

    // Grab and click the add button for the first one, 'Aspic - Light'
    page.clickExpansionAddButton('dairy');
    cy.get('.mat-dialog-title')
      .should('contain.text', 'Add Aspic - Light to your Pantry');
  });

  it('Should go to a product in an expansion tab, click add to shopping list, and read the dialog', () => {

    // Grab and click the add button for the first one, 'Aspic - Light'
    page.clickExpansionAddShoppingButton('dairy');
    cy.get('.mat-dialog-title')
    .should('contain.text', 'Add Aspic - Light to your Shopping List');
  });
});

describe('Add Product to Pantry List', () => {

  beforeEach(() => {
    page.navigateTo();
    cy.wait(1000);
  });

  it('should enter the purchase date and notes of a pantry item then click the button', () => {
    page.clickExpansionAddButton('dairy');
    page.enterPurchaseDate('2022-10-10');
    page.enterNotes('This is a test');
    page.clickDialogAddButton();
    cy.get('.mat-simple-snack-bar-content').should('contain.text', 'Aspic - Light successfully added to your pantry.');
  });

});

describe('Add Product to Shopping List', () => {

  beforeEach(() => {
    page.navigateTo();
    cy.wait(1000);
  });

  it('should enter the count of a shoppinglist item then click the button', () => {
    page.clickExpansionAddShoppingButton('dairy');
    page.enterCount('1');
    page.clickDialogAddShoppingButton();
    cy.get('.mat-simple-snack-bar-content').should('contain.text', 'Aspic - Light x1 successfully added to your Shopping List.');
  });

});

describe('Delete from Product List', () => {

  beforeEach(() => {
    page.navigateTo();
    cy.wait(1000);
  });

  it('should click the delete button on a product and confirm delete', () => {
    page.clickExpansionDeleteButton('baked goods');
    page.clickDialogDeleteButton();
    cy.get('.mat-simple-snack-bar-content').should('contain.text', 'Bar - Granola Trail Mix Fruit Nut successfully deleted.');
  });

});
