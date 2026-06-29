describe('Liste des thèmes', () => {

  beforeEach(() => {

    // Connexion
    cy.visit('/auth/login');

    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'jwt-token'
      }
    }).as('login');

    cy.intercept('GET', '**/api/user/me', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'john',
        email: 'john@test.com',
        password: ''
      }
    }).as('me');

    cy.intercept('GET', '**/api/article', {
      statusCode: 200,
      body: []
    }).as('articles');

    cy.get('#login').type('john@test.com');
    cy.get('#password').type('Password123!');
    cy.contains('button', 'Se connecter').click();

    cy.wait('@login');
    cy.wait('@me');
    cy.wait('@articles');

    // Mock des thèmes AVANT la navigation
    cy.intercept('GET', '**/api/subject', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Angular',
          description: 'Framework Angular',
          followed: false
        },
        {
          id: 2,
          name: 'Cypress',
          description: 'Tests E2E',
          followed: true
        }
      ]
    }).as('subjects');

    // Navigation via le menu
    cy.contains('Thèmes').click();

    cy.wait('@subjects');

    cy.url().should('include', '/mdd/subjects');

  });


  it('affiche la liste des thèmes', () => {

    cy.get('.subject-grid')
      .should('be.visible');

  });


  it('affiche deux thèmes', () => {

    cy.contains('Angular')
      .should('exist');

    cy.contains('Cypress')
      .should('exist');

  });


  it('affiche leur description', () => {

    cy.contains('Framework Angular')
      .should('exist');

    cy.contains('Tests E2E')
      .should('exist');

  });

});
