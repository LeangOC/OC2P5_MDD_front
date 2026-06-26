// npx cypress run --spec cypress/e2e/article-detail.cy.ts
describe('Détail d’un article', () => {

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
            content: 'Contenu du premier article',
            publishedAt: '2026-01-01',
            userName: 'john',
            subjectName: 'Angular',
            comments: []
          }
        ]
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


    cy.url()
      .should('include', '/mdd/article');

  });


  it('ouvre le détail d’un article', () => {


    cy.intercept(
      'GET',
      '**/api/article/1',
      {
        statusCode: 200,
        body: {
          id: 1,
          title: 'Premier article',
          content: 'Contenu du premier article',
          publishedAt: '2026-01-01',
          userName: 'john',
          subjectName: 'Angular',
          comments: []
        }
      }
    ).as('articleDetail');


    cy.get('.article-card')
      .first()
      .click();


    cy.wait('@articleDetail');


    cy.url()
      .should('include', '/mdd/article/article-detail/1');

  });


  it('affiche les informations de l’article', () => {


    cy.intercept(
      'GET',
      '**/api/article/1',
      {
        statusCode:200,
        body:{
          id:1,
          title:'Premier article',
          content:'Contenu du premier article',
          publishedAt:'2026-01-01',
          userName:'john',
          subjectName:'Angular',
          comments:[]
        }
      }
    ).as('articleDetail');


    cy.get('.article-card')
      .first()
      .click();


    cy.wait('@articleDetail');


    cy.contains('Premier Article')
      .should('exist');

    cy.contains('Contenu du premier article')
      .should('exist');

    cy.contains('john')
      .should('exist');

    cy.contains('Angular')
      .should('exist');

  });


  it('affiche la section commentaires', () => {


    cy.intercept(
      'GET',
      '**/api/article/1',
      {
        statusCode:200,
        body:{
          id:1,
          title:'Premier article',
          content:'Contenu',
          publishedAt:'2026-01-01',
          userName:'john',
          subjectName:'Angular',
          comments:[
            {
              id:1,
              content:'Très bon article',
              userName:'bob'
            }
          ]
        }
      }
    ).as('articleDetail');


    cy.get('.article-card')
      .first()
      .click();


    cy.wait('@articleDetail');


    cy.get('app-comments')
      .should('exist');

  });


  it('revient à la liste des articles', () => {


    cy.intercept(
      'GET',
      '**/api/article/1',
      {
        statusCode:200,
        body:{
          id:1,
          title:'Premier article',
          content:'Contenu',
          publishedAt:'2026-01-01',
          userName:'john',
          subjectName:'Angular',
          comments:[]
        }
      }
    ).as('articleDetail');


    cy.get('.article-card')
      .first()
      .click();


    cy.wait('@articleDetail');


    cy.get('.back-icon')
      .click();


    cy.url()
      .should('include', '/mdd/article');

  });

});
