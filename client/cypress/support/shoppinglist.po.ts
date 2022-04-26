
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
    return cy.get('.shopping-list-interactive');
  }

  clickInteractiveViewToggle() {
    return cy.get('#interactive-view-button').click();
  }

  /**
   * Get the store tabs on the interactive shoppinglist
   *
   * @param position the order of the store tab (first tab is '0')
   */
  getStoreTab(position: number) {
    return cy.get('.store-tabs-group .mat-tab-labels div[role="tab"]').eq(position);
  }

  /**
   *  Get the store group list of products
   *
   * @param position the order of the store list (first store grouping of items is '0')
   */
  getStoreProductsPanel(position: number) {
    return cy.get('.store-tabs-group .mat-tab-body[role="tabpanel"]').eq(position);
  }

  getStoreItems(position: number) {
    this.getStoreProductsPanel(position);
    return cy.get('.shopping-list-item-option');
  }

  /**
   * Change the shoppinglist view.
   *
   * @param viewType Which view type to change to: "interactive" or "print".
   */
   changeView(viewType: 'interactive' | 'print') {
    return cy.get(`[data-test=viewTypeGroup] #${viewType}-view-button`).click();
  }

  getPrintShoppingList() {
    return cy.get('.shopping-list-print');
  }

  getPrintButton() {
    return cy.get('.print-button');
  }
}
