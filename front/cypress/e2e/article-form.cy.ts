// npx cypress run --spec cypress/e2e/article-form.cy.ts
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
        body: [
          {
            id: 1,
            title: 'Premier article',
            content: 'Contenu',
            publishedAt: '2026-01-01',
            userName: 'john',
            subjectName: 'Angular',
            comments: []
          }
        ]
      }
    ).as('articles');

    cy.get('#login').type('john@test.com');
    cy.get('#password').type('Password123!');

    cy.contains('button', 'Se connecter').click();

    cy.wait('@login');
    cy.wait('@me');
    cy.wait('@articles');

    cy.url().should('include', '/mdd/article');

    // Interception AVANT d'ouvrir le formulaire
    cy.intercept(
      'GET',
      '**/api/subject',
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

    cy.intercept(
      'POST',
      '**/api/article',
      {
        statusCode: 200,
        body: 'New Article created'
      }
    ).as('createArticle');

    // Navigation normale
    cy.contains('Créer un article')
      .click();

    cy.wait('@subjects');

    cy.url()
      .should('include', '/mdd/article/article-form');

  });


  it('affiche le formulaire', () => {

    cy.contains('Créer un nouvel article')
      .should('be.visible');

    cy.get('mat-select')
      .should('exist');

    cy.get('input[name="title"]')
      .should('exist');

    cy.get('textarea[name="content"]')
      .should('exist');

  });


  it('désactive le bouton tant que le formulaire est vide', () => {

    cy.contains('button', 'Créer')
      .should('be.disabled');

  });


  it('affiche les thèmes disponibles', () => {

    cy.get('mat-select')
      .click();

    cy.get('mat-option')
      .should('have.length', 2);

    cy.contains('Angular')
      .should('exist');

    cy.contains('Cypress')
      .should('exist');

  });


  it('crée un article', () => {

    cy.get('mat-select')
      .click();

    cy.contains('mat-option', 'Angular')
      .click();

    cy.get('input[name="title"]')
      .type('Mon premier article');

    cy.get('textarea[name="content"]')
      .type('Voici le contenu de mon premier article.');

    cy.contains('button', 'Créer')
      .click();

    cy.wait('@createArticle')
      .its('request.body')
      .should((body) => {

        expect(body.userId).to.equal('1');
        expect(body.subjectId).to.equal(1);
        expect(body.title).to.equal('Mon premier article');
        expect(body.content).to.equal('Voici le contenu de mon premier article.');

      });

    cy.url()
      .should('include', '/mdd/article');

  });

});
