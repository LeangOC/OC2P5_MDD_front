// npx cypress run --spec cypress/e2e/me.cy.ts
describe('Profil utilisateur', () => {


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


    cy.contains('button','Se connecter')
      .click();


    cy.wait('@login');
    cy.wait('@me');
    cy.wait('@articles');


    // Mock des sujets abonnés
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
            followed:true
          },
          {
            id:2,
            name:'Cypress',
            description:'Tests E2E',
            followed:false
          }
        ]
      }
    ).as('subjects');


    // Navigation profil
    cy.get('mat-icon')
      .contains('account_circle')
      .click();


    cy.wait('@subjects');


    cy.url()
      .should('include','/mdd/me');

  });



  it('affiche le profil utilisateur', () => {


    cy.contains('Profil utilisateur')
      .should('be.visible');


    cy.get('input')
      .eq(0)
      .should('have.value','john');


    cy.get('input')
      .eq(1)
      .should('have.value','john@test.com');


  });



  it('affiche les abonnements', () => {


    cy.contains('Abonnements')
      .should('be.visible');


    cy.contains('Angular')
      .should('exist');


  });



  it('modifie le profil utilisateur', () => {


    cy.intercept(
      'PUT',
      '**/api/user/1',
      {
        statusCode:200,
        body:{
          token:'new-token'
        }
      }
    ).as('updateUser');


    cy.get('input[formControlName="username"]')
      .clear()
      .type('johnUpdated');


    cy.get('input[formControlName="email"]')
      .clear()
      .type('john.updated@test.com');


    cy.contains('Sauvegarder')
      .click();


    cy.wait('@updateUser')
      .its('response.statusCode')
      .should('eq',200);
  });



  it('déconnecte l’utilisateur', () => {


    cy.contains('Se déconnecter')
      .click();


    cy.url()
      .should('eq','http://localhost:4200/');


    cy.window()
      .then((window)=>{
        expect(window.localStorage.getItem('token'))
          .to.be.null;
      });

  });


});
