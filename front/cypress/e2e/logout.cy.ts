// npx cypress run --spec cypress/e2e/logout.cy.ts
describe('Déconnexion utilisateur', () => {

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
        statusCode:200,
        body:[
          {
            id:1,
            title:'Premier article',
            content:'Contenu',
            publishedAt:'2026-01-01',
            userName:'john',
            subjectName:'Angular',
            comments:[]
          }
        ]
      }
    ).as('articles');


    cy.get('#login')
      .type('john@test.com');


    cy.get('#password')
      .type('Password123!');


    cy.contains('button','Se connecter')
      .click();


    cy.wait('@login');
    cy.wait('@me');
    cy.wait('@articles');


    cy.url()
      .should('include','/mdd/article');


  });


  it('affiche le profil utilisateur', () => {

    cy.get('mat-icon')
      .contains('account_circle')
      .click();


    cy.url()
      .should('include','/mdd/me');


    cy.contains('Profil utilisateur')
      .should('be.visible');

  });


  it('déconnecte l’utilisateur', () => {


    cy.get('mat-icon')
      .contains('account_circle')
      .click();


    cy.url()
      .should('include','/mdd/me');


    cy.contains('Se déconnecter')
      .click();


    cy.url()
      .should('eq','http://localhost:4200/');


    cy.window()
      .then((window) => {

        expect(
          window.localStorage.getItem('token')
        ).to.be.null;

      });

  });


  it('empêche l’accès aux pages protégées après déconnexion', () => {


    cy.get('mat-icon')
      .contains('account_circle')
      .click();


    cy.contains('Se déconnecter')
      .click();


    cy.url()
      .should('eq', 'http://localhost:4200/');


    cy.visit('/mdd/article');


    cy.url()
      .should('eq', 'http://localhost:4200/');

  });


});
