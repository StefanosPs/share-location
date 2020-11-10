let createdUser = {};

// beforeEach(() => {
//   cy.task('seedUserDB');
//   cy.login();
// })
describe('User API', () => {
	before(() => {
		cy.task('seedUserDB').then(() => {
			cy.login();
		});
	});
	after(() => {
		cy.logout();
	});

	it('CREATE', () => {
		cy.request('POST', '/api/user/', {
			fullName: 'fullnasme4',
			username: 'admin29',
			password: 'Admin!@sss2ss4',
			role: 'Administrator'
		}).then(response => {
			// console.log(response);
			const { status, headers, body } = response;
			expect(status).to.eq(201);
			const { statusCode, data } = body;
			createdUser = { ...data[0] };
			expect(statusCode).to.eq(201);
			expect(data).to.be.a('array');
			expect(data).to.have.lengthOf(1);
		});
	});

	it('READ', () => {
		cy.request('/api/user/')
			.its('headers')
			.its('content-type')
			.should('include', 'application/json');
		cy.request('/api/user/')
			.its('body')
			.its('data')
			.should('have.length', 4);
	});

	it('UPDATE', () => {
		cy.request('PUT', '/api/user/', {
			username: 'admin44'
		}).then(response => {
			// console.log(response);
			const { status, headers, body } = response;
			expect(status).to.eq(405);
		});

		cy.request('PUT', `/api/user/${createdUser.id}`, {
			username: 'admin44'
		}).then(response => {
			// console.log(response);
			const { status, headers, body } = response;
			expect(status).to.eq(422);
			const { statusCode, errors } = body;
			expect(statusCode).to.eq(422);
			expect(errors).to.be.a('array');
			expect(errors).to.have.lengthOf(1);
		});

		cy.request('PUT', `/api/user/${createdUser.id}`, {
			fullName: 'full name 4'
		}).then(response => {
			// console.log(response);
			const { status, headers, body } = response;
			expect(status).to.eq(200);
			const { statusCode, data } = body;
			expect(statusCode).to.eq(200);
			expect(data).to.be.a('array');
			expect(data).to.have.lengthOf(1);
		});
	});

	it('DELETE', () => {
		cy.request('DELETE', '/api/user/', {}).then(response => {
			// console.log(response);
			const { status, headers, body } = response;
			expect(status).to.eq(405);
		});

		cy.request('DELETE', '/api/user/0', {}).then(response => {
			const { status, headers, body } = response;
			expect(status).to.eq(422);
			const { statusCode, errors } = body;
			expect(statusCode).to.eq(422);
			// console.log(errors)
		});

		cy.request('DELETE', `/api/user/${createdUser.id}`).then(response => {
			const { status, headers, body } = response;
			expect(status).to.eq(200);
			const { statusCode, data } = body;
			expect(statusCode).to.eq(200);
			expect(data).to.be.a('array');
			expect(data).to.have.lengthOf(0);
		});
	});
});
