# P6-Full-Stack-reseau-dev

## Front

### clone 
https://github.com/OpenClassrooms-Student-Center/Developpez-une-application-full-stack-complete

### Installation package Angular
>$ npm install

### Démarrage de l'application
> ng serve --host 0.0.0.0

### Lancer les tests Jest Coverage
> $ npx jest --coverage


### Lancer les tests Cypress
> npx cypress run

########################################################################################################


### dev1
1. Application de "README.md" du clone:

- cd front ( il a besoin du fichier package.json )

- npm install
  >$ npm install  
  added 926 packages, and audited 927 packages in 40s

- Démarrage de l'application
  > $ ng serve  
  ** Angular Live Development Server is listening on http://localhost:4200/ **

  Page d'acueil :
  ![img1_dev1.png](ScreenShot/img1_dev1.png)

- Build :
  >$ npx http-server dist/front  
  Starting up http-server, serving dist/front  
  http-server version: 14.1.1  
  Available on:  
  http://169.254.123.141:8080  
  http://192.168.56.1:8080  
  http://192.168.0.16:8080  
  http://127.0.0.1:8080  
  http://172.22.192.1:8080  
  Hit CTRL-C to stop the server

  Page d'acceuil :  
  ![img2_dev1.png](assets/img1_dev1.png)  

### dev2
Remplacer par la vraie page d'Accueil.  
Refactor : home.component.html, home.component.scss  
Page d'accueil desktop :    
![Page_Accueil_Desktop.png](assets/Page_Accueil_Desktop.png)  
Page d'acceuil Mobile :   
![Page_Accueil_Mobile.png](assets/Page_Accueil_Mobile.png)  

### dev2_MaterialAngular
- Page d'Accueil Figma avec Material Angular  
- Implémentation bouton "mat-stroked-button"  
- Bouton rectangle arrondi : surcharge "mat-stroked-button" avec la classe "btn-rounded"  

Page d'accueil desktop avec Material Angular bouton  btn-rounded :  
![Page_Accueil_Desktop_bouton_MaterialAngular.png](assets/Page_Accueil_Desktop_bouton_MaterialAngular.png)  

Page d'accueil mobile avec Material Angular bouton  btn-rounded :  
![Page_Accueil_Mobile_Bouton_MareiralAngular.png](assets/Page_Accueil_Mobile_Bouton_MareiralAngular.png)  

### dev3
Implémenter la page de connexion  
![Page_Connexion_Desktop.png](assets/Page_Connexion_Desktop.png)    
![Page_Connexion_Mobile.png](assets/Page_Connexion_Mobile.png)


### dev4
Implémentation de la page d'inscription  
![Page_Inscription_Desktop.png](assets/Page_Inscription_Desktop.png)  
![Page_Inscription_Mobile.png](assets/Page_Inscription_Mobile.png)


### dev5
- brancher la page d'enregistrement à un Api /api/auth/register
- $ ng generate service services/auth    
  ![CORS_Erreur_API_Acces.png](assets/CORS_Erreur_API_Acces.png)      
  => installation sur Spring Boot : CorsConfig.java

- ![Page2_Inscription.png](assets/Page2_Inscription.png)   

..............

### SolutionF
Refactorisations et Implémentations complets des codes : 
- Inscription
- Connexion
- Modifier le profile
- logout
- Connexion
- Abonnement à un thèmes
- fil d'actualité
- ajoute un article
- ajout une commentaire à un article

Page des thèmes de MDD :  
![Pages_Themes.png](assets/Pages_Themes.png)

Pour le reste des images voir "Documentation et rapport du projet MDD" pour les screenshots dans l'annexe A.


...........

### SolutionFTest
Tests :  
- Jest coverage  

  Rapport : front/coverage/lcov-report/index.html  
  ![Jest_Coverage.png](assets/Jest_Coverage.png)


- Tests Cypress  

  Rapport de test Cypress  
  ![Cypress_Tests.png](assets/Cypress_Tests.png)

..............

# main
- Merge  


