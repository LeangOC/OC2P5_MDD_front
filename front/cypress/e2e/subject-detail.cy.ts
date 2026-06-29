describe('Détail d’un thème', () => {


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


    cy.get('#login')
      .type('john@test.com');


    cy.get('#password')
      .type('Password123!');


    cy.contains(
      'button',
      'Se connecter'
    )
      .click();


    cy.wait('@login');
    cy.wait('@me');
    cy.wait('@articles');


    cy.url()
      .should('include','/mdd/article');


    /*
      Mock des thèmes avant navigation
    */
    cy.intercept(
      'GET',
      '**/api/subject',
      {
        statusCode:200,
        body:[
          {
            id:1,
            name:'Angular',
            description:'Framework frontend',
            followed:false
          }
        ]
      }
    ).as('subjects');


    /*
      Navigation Angular via le menu
    */
    cy.contains('Thèmes')
      .click();


    cy.wait('@subjects');


  });



  it('affiche la liste des thèmes', () => {


    cy.get('.subject-card')
      .should('have.length',1);


    cy.contains('Angular')
      .should('be.visible');

  });

});
