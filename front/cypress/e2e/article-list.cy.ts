
describe('Liste des articles', () => {

  beforeEach(() => {

    cy.visit('/auth/login');


    cy.intercept(
      'POST',
      '**/api/auth/login',
      {
        statusCode: 200,
        body: {
          token:'jwt-token'
        }
      }
    ).as('login');


    cy.intercept(
      'GET',
      '**/api/user/me',
      {
        statusCode:200,
        body:{
          id:1,
          username:'john',
          email:'john@test.com',
          password:''
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
          },
          {
            id:2,
            title:'Deuxième article',
            content:'Autre contenu',
            publishedAt:'2026-01-02',
            userName:'jane',
            subjectName:'Cypress',
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

  it('affiche la page des articles', () => {

    cy.get('.article-grid')
      .should('be.visible');

  });


  it('affiche les articles reçus', () => {

    cy.get('.article-card')
      .should('have.length', 2);

  });


  it('affiche le titre des articles', () => {

    cy.contains('Premier Article')
      .should('be.visible');

  });


  it('ouvre le formulaire de création', () => {

    cy.contains('Créer un article')
      .click();

    cy.url()
      .should('include', '/mdd/article/article-form');

  });


});
