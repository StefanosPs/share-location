// @ts-check
/* eslint-env mocha */
describe('LogIn API', () => {
  const initialItems = [
    {
      fullName: 'full name 1',
      username: 'username1',
      password: 'p2ssword',
      role: 'USER',
      status: 'ACTIVE',
      emails: ['mail01@gmail.com', 'mail02@gmail.com']
    },
    {
      fullName: 'full name 2',
      username: 'username2',
      password: 'p2ssword',
      role: 'USER',
      status: 'ACTIVE',
      emails: ['mail01@gmail.com', 'mail02@gmail.com']
    },
    {
      fullName: 'full name 3',
      username: 'username3',
      password: 'p2ssword',
      role: 'USER',
      status: 'ACTIVE',
      emails: ['mail01@gmail.com', 'mail02@gmail.com']
    }
  ];

  const getUser = () =>
    cy
      .request('/api/user/')
      .its('body')
      .its('data');

  const createUser = item => cy.request('POST', '/api/user/', item);

  const deleteUser = item => cy.request('DELETE', `/api/user/${item.id}`);

  const deleteAll = () => getUser().each(deleteUser);

  const reset = () => {
    deleteAll();
    initialItems.forEach(createUser);
  };

  before(reset);
  //   afterEach(reset);

  it('returns JSON', () => {
    cy.request('/api/user/')
      .its('headers')
      .its('content-type')
      .should('include', 'application/json');
  });

  it('loads 3 items', () => {
    cy.request('/api/user/')
      .its('body')
      .its('data')
      .should('have.length', 3);
  });

  it('deletes an item', () => {
    cy.request(`/api/user/`)
      .its('body')
      .its('data')
      .then(data => {
        // console.log(data);
        cy.request('DELETE', `/api/user/${data[0].id}`);
      })
      .then(() => {
        getUser().should('have.length', 2);
      });
  });
});
