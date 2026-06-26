describe('Création d’article', () => {

  beforeEach(() => {

    cy.visit('/auth/login');

    cy.intercept(
      'POST',
      '**/api/auth/login',
      {
        statusCode: 200,
        body: {
          token: 'jwt-token'
        }
      }
    ).as('login');

    cy.intercept(
      'GET',
      '**/api/user/me',
      {
        statusCode: 200,
        body: {
          id: 1,
          username: 'john',
          email: 'john@test.com',
          password: ''
        }
      }
    ).as('me');

    cy.intercept(
      'GET',
      '**/api/article',
      {
        statusCode: 200,
        body: []
      }
    ).as('articles');

    cy.get('#login')
      .type('john@test.com');

    cy.get('#password')
      .type('Password123!');

    cy.contains('button', 'Se connecter')
      .click();

    cy.wait('@login');
    cy.wait('@me');
    cy.wait('@articles');

    cy.visit('/mdd/article/article-form');

  });

  it('affiche le formulaire', () => {

    cy.contains('Créer un nouvel article')
      .should('exist');

    cy.contains('Créer')
      .should('exist');

  });

  it('désactive le bouton quand le formulaire est vide', () => {

    cy.contains('button', 'Créer')
      .should('be.disabled');

  });

  it('charge les thèmes disponibles', () => {

    cy.intercept(
      'GET',
      '**/api/subject*',
      {
        statusCode: 200,
        body: [
          {
            id: 1,
            name: 'Angular'
          },
          {
            id: 2,
            name: 'Cypress'
          }
        ]
      }
    ).as('subjects');

    cy.reload();

    cy.wait('@subjects');

    cy.get('mat-select')
      .click();

    cy.contains('Angular')
      .should('exist');

    cy.contains('Cypress')
      .should('exist');

  });

  it('crée un article avec succès', () => {

    cy.intercept(
      'GET',
      '**/api/subject*',
      {
        statusCode: 200,
        body: [
          {
            id: 1,
            name: 'Angular'
          }
        ]
      }
    ).as('subjects');

    cy.intercept(
      'POST',
      '**/api/article',
      {
        statusCode: 200,
        body: {}
      }
    ).as('createArticle');

    cy.reload();

    cy.wait('@subjects');

    cy.get('mat-select')
      .click();

    cy.contains('Angular')
      .click();

    cy.get('input[name="title"]')
      .type('Mon premier article');

    cy.get('textarea[name="content"]')
      .type('Contenu complet de mon article.');

    cy.contains('button', 'Créer')
      .click();

    cy.wait('@createArticle');

    cy.url()
      .should('include', '/mdd/article');

  });

  it('gère une erreur lors de la création', () => {

    cy.intercept(
      'GET',
      '**/api/subject*',
      {
        statusCode: 200,
        body: [
          {
            id: 1,
            name: 'Angular'
          }
        ]
      }
    ).as('subjects');

    cy.intercept(
      'POST',
      '**/api/article',
      {
        statusCode: 500,
        body: {}
      }
    ).as('createArticleError');

    cy.reload();

    cy.wait('@subjects');

    cy.get('mat-select')
      .click();

    cy.contains('Angular')
      .click();

    cy.get('input[name="title"]')
      .type('Mon premier article');

    cy.get('textarea[name="content"]')
      .type('Contenu complet de mon article.');

    cy.contains('button', 'Créer')
      .click();

    cy.wait('@createArticleError');

    cy.contains('Failed to create Article')
      .should('exist');

  });

});
