import { ShoppinglistPage } from '../support/shoppinglist.po';

const page = new ShoppinglistPage();

describe('Shoppinglist', () => {
  beforeEach(() => {
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
    page.getStoreTab(0).should('exist');
    page.getStoreTab(1).should('exist');
    page.getStoreTab(2).should('exist');
    page.getStoreTab(3).should('exist');
  });

  it('Should have products', () => {
    page.getStoreTab(0).should('exist');
  });
});

describe('Print Shoppinglist', () => {
  beforeEach(() => {
    page.navigateTo();
    page.changeView('print');
  });

  it('Should have the correct store lists and products', () => {
    page.getUrl();
  });

  it('Should click the print button', () => {
    page.getUrl();
  });
});
