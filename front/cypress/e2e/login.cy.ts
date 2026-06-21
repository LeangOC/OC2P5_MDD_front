describe('Login', () => {

  beforeEach(() => {
    cy.visit('/auth/login');
  });

  it('affiche la page connexion', () => {

    cy.contains('Se connecter');

    cy.get('#login').should('exist');
    cy.get('#password').should('exist');
  });

  it('désactive le bouton si formulaire invalide', () => {

    cy.contains('button', 'Se connecter')
      .should('be.disabled');
  });

  it('connecte un utilisateur avec succès', () => {

    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        token: 'jwt-token'
      }
    }).as('login');

    cy.intercept('GET', '**/user/me', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'john',
        email: 'john@test.com'
      }
    }).as('me');

    cy.intercept('GET', '**/article', {
      statusCode: 200,
      body: []
    }).as('articles');

    cy.get('#login')
      .type('john@test.com');

    cy.get('#password')
      .type('Password123!');

    cy.contains('button', 'Se connecter')
      .click();

    cy.wait('@login');
    cy.wait('@me');
    cy.wait('@articles');

    cy.location('pathname', { timeout: 10000 })
      .should('eq', '/mdd/article');
  });

  it('gère une erreur de connexion', () => {

    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: {}
    }).as('loginError');

    cy.get('#login')
      .type('john@test.com');

    cy.get('#password')
      .type('Password123!');

    cy.contains('button', 'Se connecter')
      .click();

    cy.wait('@loginError');
  });

});
