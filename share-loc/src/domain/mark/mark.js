/**
 * Mark
 *
 * TODO :
 *    Add objprp
 *
 */
class Mark {
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

export default Mark;
