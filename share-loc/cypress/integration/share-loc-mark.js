// @ts-check
/* eslint-env mocha */

// beforeEach(() => {
//   cy.task('seedUserDB');
//   cy.login();
// })

const URL = `/api/mark`;
const users = [];
let marks = {};
describe('Mark API', () => {
  const getUser = () => {
    cy.request('/api/user/')
      .its('body')
      .its('data')
      .then(data => {
        data.forEach(element => {
          users.push({...element});
        });
      });
  };

  before(() => {
    cy.task('seedUserDB');
    cy.task('seedMarkDB');
    cy.login();

    getUser();
  });
  after(() => {
    cy.logout();
  });
  it(`Create`, () => {
    users.forEach(user => {
      // it(`Create mark for the user = ${user.username}`, () => {
      cy.request('POST', `${URL}`, {
        userId: user.id,
        position: {lat: 37 + Math.random(), lng: 23 + Math.random()}
      }).then(response => {
        // console.log(response);
        if (user.username === 'username1') {
          const {status, headers, body} = response;
          expect(status).to.eq(201);
          const {statusCode, data} = body;
          expect(status).to.eq(201);
          marks = {...marks[0]};
        } else {
          const {status, headers, body} = response;
          expect(status).to.eq(422);
          const {statusCode, errors} = body;
          expect(status).to.eq(422);
          expect(errors).to.be.a('array');
          expect(errors).to.have.lengthOf(1);
        }
      });
      // });
    });
  });


  it('READ', () => {
    cy.request(`${URL}`)
    .its('headers')
    .its('content-type')
    .should('include', 'application/json');
    cy.request(`${URL}`)
      .its('body')
      .its('data')
      .should('have.length', 1);
  });
});
