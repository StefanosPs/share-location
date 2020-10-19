/**
 * Connection
 *
 * TODO :
 *    Add objprp
 *
 */
class Connection {
	constructor(details = {}) {
		Object.assign(this, details);
	}

	getId() {
		if (this.id > 0) {
			return this.id;
		}
		return 0;
	}
}

export default Connection;
