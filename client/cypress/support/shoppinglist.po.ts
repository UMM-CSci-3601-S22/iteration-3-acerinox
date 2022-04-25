
export class ShoppinglistPage {

  navigateTo() {
    return cy.visit('./shoppinglist');
  }

  getUrl() {
    return cy.url();
  }

  getShoppinglistTitle() {
    return cy.get('.shoppinglist-title');
  }

  getInteractiveShoppingList() {
    cy.get('shopping-list-interactive');
  }

  clickInteractiveViewToggle() {
    cy.get('#interactive-view-button').click();
  }

  clickPrintViewToggle() {
    cy.get('#print-view-button').click();
  }

  getPrintShoppingList() {
    cy.get('.shopping-list-print');
  }

  getPrintButton() {
    cy.get('.print-button');
  }
}
