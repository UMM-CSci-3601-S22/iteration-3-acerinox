import { ShoppinglistPage } from '../support/shoppinglist.po';

const page = new ShoppinglistPage();

describe('Shoppinglist', () => {
  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct url', () => {
    page.getUrl().should('contain.text', './shoppinglist');
  });

  it('Should have the correct title', () => {
    page.getShoppinglistTitle().should('have.text', ' My Shopping List ');
  });

  it ('Should have a print button on the print view', () => {
    page.clickPrintViewToggle();
    page.getPrintButton();
  });
});

describe('Interactive Shoppinglist', () => {
  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct store tabs', () => {
    page.getUrl();
  });

  it('Should have the correct products', () => {
    page.getUrl();
  });
});

describe('Print Shoppinglist', () => {
  beforeEach(() => {
    page.navigateTo();
    page.clickPrintViewToggle();
  });

  it('Should have the correct store lists and products', () => {
    page.getUrl();
  });

  it('Should click the print button', () => {
    page.getUrl();
  });
});
