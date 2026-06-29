describe('Protection des routes privées', () => {


  beforeEach(() => {

    // S'assurer qu'il n'y a pas de session
    cy.clearLocalStorage();

  });


  it('bloque l’accès aux articles sans connexion', () => {

    cy.visit('/mdd/article');


    cy.url()
      .should('eq', 'http://localhost:4200/');

  });


  it('bloque l’accès aux thèmes sans connexion', () => {

    cy.visit('/mdd/subjects');


    cy.url()
      .should('eq', 'http://localhost:4200/');

  });


  it('bloque l’accès au profil sans connexion', () => {

    cy.visit('/mdd/me');


    cy.url()
      .should('eq', 'http://localhost:4200/');

  });


  it('permet l’accès après connexion', () => {


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


});
