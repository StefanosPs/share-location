// @ts-check
/* eslint-env mocha */
let token = '';
describe('LogIn API', () => {
  before(() => {
    Cypress.env('cust_auth_token', null);
    cy.task('seedUserDB');
  });
  //   afterEach(reset);

  it('LOGIN routine', () => {
    cy.request('POST', '/jwt/login', {
      username: 'admin',
      password: 'admin'
    }).then(response => {
      const {status, body} = response;
      expect(status).to.eq(422);
      expect(body.statusCode).to.eq(422);
      expect(body.errors).to.exist;
      if (body.errors) {
        expect(body.errors).to.have.length(2);
      }
    });

    cy.request('POST', '/jwt/login', {
      username: 'username1',
      password: 'p2ssword'
    }).then(response => {
      console.log(response);
      const {status, headers, body} = response;
      expect(status).to.eq(200);
      expect(body.statusCode).to.eq(200);
      token = body.data[0].token;
      Cypress.env('cust_auth_token', token);
      // cy.setCookie('session_id', '189jd09sufh33aaiidhf99d09')
    });

    // cy.getCookies().then(resp => {
    //   console.log(resp);
    //   for (let index = 0; index < resp.length; index++) {
    //     const {domain, value, ...oprions} = resp[index];
    //     cy.setCookie(domain, value, oprions);
    //   }
    // });
 
    
    cy.request('POST', '/jwt/refresh-token').then(response => {
      const {status, body} = response;
      expect(status).to.eq(200);
    });
  
    cy.request('POST', '/jwt/logout').then(response => {
      const {status, body} = response;
      expect(status).to.eq(200);
    });
  });
});
