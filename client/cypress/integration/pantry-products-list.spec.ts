import { PantryProductsListPage } from 'cypress/support/pantry-products-list.po';

const page = new PantryProductsListPage();

describe('Pantry List Expansion Panels and tables', () => {

  beforeEach(() => {
    page.navigateTo();
    cy.wait(1000);
  });

  it('Should check that expansion panels have the correct titles and items by categories', () => {

    page.getExpansionTitleByCategory('bakery').should('have.text', ' bakery ');

    page.getTableProductNameByCategory('bakery').first().should('have.text', ' Island Oasis - Raspberry ');

    page.getTablePurchaseDateByCategory('bakery').first().should('have.text', ' 2022-07-15 ');

    page.getTableNotesByCategory('bakery').first().should('contains.text', ' Integer tincidunt ');

    page.getExpansionTitleByCategory('meat').should('have.text', ' meat ');

    page.getTableProductNameByCategory('meat').first().should('have.text', ' Nantucket Apple Juice ');

    page.getTablePurchaseDateByCategory('meat').first().should('have.text', ' 2022-05-26 ');

    page.getTableNotesByCategory('meat').first().should('contains.text', ' Phasellus in ');

  });

});
