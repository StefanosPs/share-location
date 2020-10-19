// @ts-check
/* eslint-env mocha */ 

// beforeEach(() => {
//   cy.task('seedUserDB');
//   cy.login();
// })
describe('Structure API', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });
  ['connections', 'user'].forEach(item => {
    it(`Structure List ${item}`, () => {
      cy.request(`/structure/list/${item}`)
        .its('headers')
        .its('content-type')
        .should('include', 'application/json');
      cy.request(`/structure/list/${item}`)
        .its('body')
        .then(resp => {
          const {statusCode, data} = resp; 
          expect(statusCode).to.eq(200);
          assert.isObject(data, `list ${item} is a valid object`);
        });
      // .its('data')
      // .should('have.length', 4);
    });

    it(`Structure Table ${item}`, () => {
      cy.request(`/structure/table/${item}`)
        .its('headers')
        .its('content-type')
        .should('include', 'application/json');
      cy.request(`/structure/table/${item}`)
        .its('body')
        .then(resp => {
          console.log(resp);
          const {statusCode, data} = resp; 
          expect(statusCode).to.eq(200);
          assert.isObject(data, `table ${item} is a valid object`);

        });
      // .its('data')
      // .should('have.length', 4);
    });
  });
});
