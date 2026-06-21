describe('Register', () => {

  beforeEach(() => {
    cy.visit('/auth/register');
  });

  it('affiche la page inscription', () => {
    cy.contains('Inscription');

    cy.get('#username').should('exist');
    cy.get('#email').should('exist');
    cy.get('#password').should('exist');
  });

  it('désactive le bouton lorsque le formulaire est invalide', () => {
    cy.contains("S'inscrire")
      .should('be.disabled');
  });

  it('affiche une erreur sur email invalide', () => {
    cy.get('#username').type('john');
    cy.get('#email').type('email-invalide');
    cy.get('#password').type('Password123!');

    cy.contains("S'inscrire")
      .should('be.disabled');
  });

  it('inscrit un utilisateur avec succès', () => {

    cy.intercept('POST', '**/auth/register', {
      statusCode: 200,
      body: {
        token: 'jwt-token'
      }
    }).as('register');

    cy.intercept('GET', '**/user/me', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'john',
        email: 'john@test.com'
      }
    }).as('me');

    // Resolver de la page /mdd/article
    cy.intercept('GET', '**/article', {
      statusCode: 200,
      body: []
    }).as('articles');

    cy.get('#username').type('john');
    cy.get('#email').type('john@test.com');
    cy.get('#password').type('Password123!');

    cy.contains("S'inscrire").click();

    cy.wait('@register');
    cy.wait('@me');
    cy.wait('@articles');

    cy.location('pathname', { timeout: 10000 })
      .should('eq', '/mdd/article');
  });

  it('gère une erreur backend', () => {

    cy.intercept('POST', '**/auth/register', {
      statusCode: 500,
      body: {}
    }).as('registerError');

    cy.get('#username').type('john');
    cy.get('#email').type('john@test.com');
    cy.get('#password').type('Password123!');

    cy.contains("S'inscrire").click();

    cy.wait('@registerError');
  });

});
