describe('Home', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('affiche la page d’accueil', () => {

    cy.contains('Se connecter');
    cy.contains("S'inscrire");
  });

  it('redirige vers login', () => {

    cy.contains('Se connecter')
      .click();

    cy.url()
      .should('include', '/auth/login');
  });

  it('redirige vers register', () => {

    cy.contains("S'inscrire")
      .click();

    cy.url()
      .should('include', '/auth/register');
  });

});
