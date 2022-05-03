import { ProductCategory } from 'src/app/products/product';

export class ProductListPage {
  navigateTo() {
    return cy.visit('./products');
  }

  getUrl() {
    return cy.url();
  }

  getProductListTitle() {
    return cy.get('.product-list-title');
  }

  getFilteredProductListItems() {
    return cy.get('.filtered-product-list-item');
  }

  getExpansionTitleByCategory(category: string) {
    return cy.get('.' + category.replace(' ', '-') + '-expansion-panel .' + category.replace(' ', '-') + '-panel-title');
  }

  getExpansionItemsByCategory(category: string) {
    return cy.get('.' + category.replace(' ', '-') + '-expansion-panel .' + category.replace(' ', '-') + '-nav-list');
  }

  /**
   * Selects a category to filter in the "Category" selector.
   *
   * @param value The category *value* to select, this is what's found in the mat-option "value" attribute.
   */
  selectCategory(value: ProductCategory) {
    // Find and click the drop down
    return cy.get('[data-test=productCategorySelect]').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[ng-reflect-value="${value}"]`).click();
  }

  /**
   * Selects a store to filter in the "Category" selector.
   *
   * @param value The store *value* to select, this is what's found in the mat-option "value" attribute.
   */
  selectStore(value: string) {
    // Find and click the drop down
    return cy.get('[data-test=productStoreSelect]').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[ng-reflect-value="${value}"]`).click();
  }

  addProductButton() {
    return cy.get('[data-test=addProductButton]');
  }

  clickDeleteButton() {
    return this.getFilteredProductListItems()
      .first()
      .within(($product) => {
        cy.get('[data-test=deleteProductButton]')
          .click();
      });
  }

  clickExpansionDeleteButton(category: string) {
    return cy.get('.' + category.replace(' ', '-') + '-expansion-panel')
      .click()
      .get('.' + category.replace(' ', '-') + '-nav-list')
      .first()
      .within(($product) => {
        cy.get('[data-test=deleteProductButton]')
          .click();
      });
  }

  clickAddButton() {
    return this.getFilteredProductListItems()
      .first()
      .within(($product) => {
        cy.get('[data-test=addToPantryButton]')
          .click();
      });
  }

  clickExpansionAddButton(category: string) {
    return cy.get('.' + category.replace(' ', '-') + '-expansion-panel')
      .click()
      .get('.' + category.replace(' ', '-') + '-nav-list')
      .first()
      .within(($product) => {
        cy.get('[data-test=addToPantryButton]')
          .click();
      });
  }

  clickAddShoppingButton() {
    return this.getFilteredProductListItems()
      .first()
      .within(($product) => {
        cy.get('[data-test=addToShoppinglistButton]')
          .click();
      });
  }

  clickExpansionAddShoppingButton(category: string) {
    return cy.get('.' + category.replace(' ', '-') + '-expansion-panel')
      .click()
      .get('.' + category.replace(' ', '-') + '-nav-list')
      .first()
      .within(($product) => {
        cy.get('[data-test=addToShoppinglistButton]')
          .click();
      });
  }

  enterPurchaseDate(purchaseDate: string) {
    return cy.get('[data-test=purchaseDateInput]').type(purchaseDate);
  }

  enterNotes(notes: string) {
    return cy.get('[data-test=notesInput]').type(notes);
  }

  enterCount(notes: string) {
    return cy.get('[data-test=countInput]').type(notes);
  }

  clickDialogAddButton() {
    return cy.get('[data-test=confirmAddProductToPantryButton]').click();
  }

  clickDialogAddShoppingButton() {
    return cy.get('[data-test=confirmAddProductToShoppinglistButton]').click();
  }

  clickDialogDeleteButton() {
    return cy.get('[data-test=dialogDelete]').click();
  }
}
