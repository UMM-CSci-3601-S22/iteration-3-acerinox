
export class PantryProductsListPage {

  navigateTo() {
    return cy.visit('./');
  }

  getUrl() {
    return cy.url();
  }

  getProductListTitle() {
    return cy.get('.pantry-products-list-title');
  }

  getExpansionTitleByCategory(category: string) {
    return cy.get('.' + category.replace(' ', '-') + '-expansion-panel .' + category.replace(' ', '-') + '-panel-title');
  }

  getTableProductNameByCategory(category: string) {
    return cy.get('.' + category.replace(' ', '-') + '-expansion-panel .' + category.replace(' ', '-')
     + '-table tbody tr .cdk-column-productName');
  }

  getTableNotesByCategory(category: string) {
    return cy.get('.' + category.replace(' ', '-') + '-expansion-panel .' + category.replace(' ', '-')
     + '-table tbody tr .pantry-detail-description');
  }

  getTablePurchaseDateByCategory(category: string) {
    return cy.get('.' + category.replace(' ', '-') + '-expansion-panel .' + category.replace(' ', '-')
     + '-table tbody tr .cdk-column-purchase_date');
  }
}
