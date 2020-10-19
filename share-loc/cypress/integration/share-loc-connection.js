// @ts-check
/* eslint-env mocha */

let createdUser = {};

const URL = `/api/connections`;
const users = [];
const marks = [];
describe('Connection API', () => {
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

  it('CREATE', () => {
    const loggedin = users.find(el =>  el.username === 'username1' );

    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      if (loggedin.username !== element.username) {
        cy.request('POST', `${URL}`, {
          watcherUserId: loggedin.id,
          observeUserId: element.id
        }).then(response => { 
          const {status, headers, body} = response;
          expect(status).to.eq(201);
          const {statusCode, data} = body;
          marks.push({...data[0]});
          expect(statusCode).to.eq(201);
          expect(data).to.be.a('array');
          expect(data).to.have.lengthOf(1);
        });
      }else{
        cy.request('POST', `${URL}`, {
          watcherUserId: element.id,
          observeUserId: loggedin.id
        }).then(response => {
          const {status, headers, body} = response;
          expect(status).to.eq(422);
          const {statusCode, errors} = body;
          expect(status).to.eq(422);
          expect(errors).to.be.a('array');
          expect(errors).to.have.lengthOf(1);
        }); 
      }
    }
  });

  it('READ', () => {
    cy.request(`${URL}`)
      .its('headers')
      .its('content-type')
      .should('include', 'application/json');
    cy.request(`${URL}`)
      .its('body')
      .its('data')
      .should('have.length', 2);
  });

  it('UPDATE', () => {
    cy.request('PUT', `${URL}`, {
      status: 'ACTIVE'
    }).then(response => { 
      const {status, headers, body} = response;
      expect(status).to.eq(405);
    });

    marks.forEach(element => {
      cy.request('PUT', `${URL}/${element.id}`, {
        status: 'ACTIVE'
      }).then(response => {
        // console.log(response);
        const {status, headers, body} = response;
        expect(status).to.eq(200);
        const {statusCode, data} = body;
        expect(statusCode).to.eq(200);
        expect(data).to.be.a('array');
        expect(data).to.have.lengthOf(1);
      });
    });
  });

  it('DELETE', () => {
    cy.request('DELETE', `${URL}`, {}).then(response => {
      // console.log(response);
      const {status, headers, body} = response;
      expect(status).to.eq(405);
    });

    cy.request('DELETE', `${URL}/0`, {}).then(response => {
      const {status, headers, body} = response;
      expect(status).to.eq(422);
      const {statusCode, errors} = body;
      expect(statusCode).to.eq(422);
      // console.log(errors)
    });

    cy.request('DELETE', `${URL}/${marks[0].id}`).then(response => {
      const {status, headers, body} = response;
      expect(status).to.eq(200);
      const {statusCode, data} = body;
      expect(statusCode).to.eq(200);
      expect(data).to.be.a('array');
      expect(data).to.have.lengthOf(0);
    });
  });
});
