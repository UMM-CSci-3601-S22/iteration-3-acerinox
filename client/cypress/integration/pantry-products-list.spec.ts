import { PantryProductsListPage } from 'cypress/support/pantry-products-list.po';

const page = new PantryProductsListPage();

describe('Pantry List Expansion Panels and tables', () => {

  beforeEach(() => {
    page.navigateTo();
    cy.wait(1000);
  });

  it('Should check that expansion panels have the correct titles and items by categories', () => {

    page.getExpansionTitleByCategory('baked goods').should('have.text', ' baked goods ');

    page.getTableProductNameByCategory('baked goods').first().should('have.text', ' Chips Potato Reg 43g ');

    page.getTablePurchaseDateByCategory('baked goods').first().should('have.text', ' 12-12-2022 ');

    page.getTableNotesByCategory('baked goods').first().should('contains.text', ' Duis consequat ');

    page.getExpansionTitleByCategory('meat').should('have.text', ' meat ');

    page.getTableProductNameByCategory('meat').first().should('have.text', ' Radish - Pickled ');

    page.getTablePurchaseDateByCategory('meat').first().should('have.text', ' 02-09-2022 ');

    page.getTableNotesByCategory('meat').first().should('contains.text', ' Duis consequat ');

  });

});
