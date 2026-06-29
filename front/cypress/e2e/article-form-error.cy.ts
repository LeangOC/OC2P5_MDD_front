describe('Erreur création article', () => {


  beforeEach(() => {


    cy.visit('/auth/login');


    cy.intercept(
      'POST',
      '**/api/auth/login',
      {
        statusCode:200,
        body:{
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
        body:[]
      }
    ).as('articles');


    // IMPORTANT : avant d'ouvrir le formulaire
    cy.intercept(
      'GET',
      '**/api/subject',
      {
        statusCode:200,
        body:[
          {
            id:'1',
            name:'Angular',
            description:'Framework'
          }
        ]
      }
    ).as('subjects');


    cy.get('#login')
      .type('john@test.com');


    cy.get('#password')
      .type('Password123!');


    cy.contains('button','Se connecter')
      .click();


    cy.wait('@login');
    cy.wait('@me');
    cy.wait('@articles');


    cy.contains('Créer un article')
      .click();


    cy.url()
      .should('include','/mdd/article/article-form');


    cy.wait('@subjects');

  });



  it('affiche une erreur si la création échoue', () => {


    cy.intercept(
      'POST',
      '**/api/article',
      {
        statusCode:500,
        body:{}
      }
    ).as('createArticleError');


    cy.get('mat-select')
      .click();


    cy.contains('Angular')
      .click();


    cy.get('input[name="title"]')
      .type('Article erreur');


    cy.get('textarea[name="content"]')
      .type('Contenu de test');


    cy.contains('button','Créer')
      .click();


    cy.wait('@createArticleError');


    cy.contains('Failed to create Article')
      .should('be.visible');


  });


});
