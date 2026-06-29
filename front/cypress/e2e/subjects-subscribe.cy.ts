describe('Abonnement à un thème', () => {

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


    cy.intercept(
      'GET',
      '**/api/subject',
      {
        statusCode:200,
        body:[
          {
            id:1,
            name:'Angular',
            description:'Framework Angular',
            followed:false
          },
          {
            id:2,
            name:'Cypress',
            description:'Tests E2E',
            followed:true
          }
        ]
      }
    ).as('subjects');


    cy.intercept(
      'POST',
      '**/api/subscription/**',
      {
        statusCode:200,
        body:{}
      }
    ).as('subscribe');


    cy.intercept(
      'DELETE',
      '**/api/subscription/**',
      {
        statusCode:200,
        body:{}
      }
    ).as('unsubscribe');


    cy.contains('Thèmes')
      .click();


    cy.wait('@subjects');


    cy.url()
      .should('include','/mdd/subjects');

  });

  it('permet de s’abonner', () => {

    cy.contains('Angular')
      .parents('.subject-card')
      .contains('S\'abonner')
      .click();

    cy.wait('@subscribe');

  });

  it('permet de se désabonner', () => {

    cy.contains('Cypress')
      .parents('.subject-card')
      .contains('Se désabonner')
      .click();

    cy.wait('@unsubscribe');

  });

});
