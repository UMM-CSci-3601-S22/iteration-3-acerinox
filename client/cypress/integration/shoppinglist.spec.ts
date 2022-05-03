import { ShoppinglistPage } from '../support/shoppinglist.po';

const page = new ShoppinglistPage();

describe('Shoppinglist', () => {
  beforeEach(() => {
    cy.task('seed:database');
    page.navigateTo();
  });

  it('Should have the correct url', () => {
    page.getUrl().should('match', /\/shoppinglist/);
  });

  it('Should have the correct title', () => {
    page.getShoppinglistTitle().should('have.text', 'My Shopping List');
  });

  it ('Should have a print button on the print view', () => {
    page.changeView('print');
    page.getPrintButton().should('exist').and('have.attr', 'printSectionId', 'print');
  });
});

describe('Interactive Shoppinglist', () => {
  beforeEach(() => {
    page.navigateTo();
    page.changeView('interactive');
  });

  it('Should have store tabs', () => {
    page.getStoreTab(0).should('exist').and('have.text', 'Other Store');
    page.getStoreTab(1).should('exist').and('have.text', 'Pomme de Terre');
    page.getStoreTab(2).should('exist').and('have.text', 'RealFoodHub');
    page.getStoreTab(3).should('exist').and('have.text', 'Willies');
  });

  it('Should have products', () => {
    page.getStoreProductsPanel(0).should('exist');
    page.getStoreProductsPanel(1).should('exist');
    page.getStoreProductsPanel(2).should('exist');
    page.getStoreProductsPanel(3).should('exist');

    // check first item of panel 0 has correct name
    page.getStoreItems(0).first();//.should('contain.text', 'Cheese'); can't check text until items are sorted (randomized from server rn)
  });
});

describe('Print Shoppinglist', () => {
  beforeEach(() => {
    page.navigateTo();
    page.changeView('print');
  });

  it('Should have the correct store lists and products', () => {
    page.getPrintShoppingList();
    cy.get('h2').first().should('contain.text', 'Other Store');
  });

  describe('Reset the Shoppinglist', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    it('should have the seed data in the store', () => {
      // there should be 4 'Other Store' items
      page.getStoreItems(0).should('have.length', 4);
    });

    it('should repopulate the shopping list when the "RESET SHOPPING LIST" button is pressed', () => {
      cy.wait(1000);
      page.resetShoppingListButton().click();
      // re-navigate to the page to work around the page refresh
      page.navigateTo();
      // The shopping list should have new items
      page.getStoreItems(0).should('have.length', 57);
    });
  });
});
