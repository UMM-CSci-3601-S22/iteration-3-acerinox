import { PantryProductsListPage } from 'cypress/support/pantry-products-list.po';

const page = new PantryProductsListPage();

describe('Pantry List Expansion Panels and tables', () => {

  beforeEach(() => {
    page.navigateTo();
    cy.wait(1000);
  });

  it('Should check that expansion panels have the correct titles and items by categories', () => {

    page.getExpansionTitleByCategory('baked goods').should('have.text', ' baked goods ');

    page.getTableProductNameByCategory('baked goods').first().should('have.text', 'Soup Campbells Beef With Veg');

    page.getTablePurchaseDateByCategory('baked goods').first().should('have.text', '31-05-2022');

    page.getTableNotesByCategory('baked goods').first().should('contains.text', 'Aenean lectus.');

    page.getExpansionTitleByCategory('meat').should('have.text', ' meat ');

    page.getTableProductNameByCategory('meat').first().should('have.text', 'Shrimp - 16/20, Iqf, Shell On');

    page.getTablePurchaseDateByCategory('meat').first().should('have.text', '18-04-2002');

    page.getTableNotesByCategory('meat').first().should('contains.text', 'Curabitur gravida');

  });

});

describe('RemovePantryItem() deletes an item from the pantry', () => {

  beforeEach(() => {
    page.navigateTo();
    cy.wait(1000);
  });

  it('Should click the remove button of the first element and read the dialog', () => {
  page.clickRemoveButton('baked goods');
  cy.get('mat-dialog-content').should('have.text', 'Remove Soup Campbells Beef With Veg from your pantry?'
  +'Note: This action cannot be undone.');
  });

  it('Should delete an item from the pantry', () => {
    page.clickRemoveButton('meat');
    page.clickDeleteButton();
    cy.get('.mat-simple-snack-bar-content').should('contain.text', 'Item successfully removed from your pantry.');
  });
});
