
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
}
