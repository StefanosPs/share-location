/**
 * A registry of dependencies that provides the app
 * with a very primitive DI mechanism.
 */
class Registry {
	constructor({eventBus, dB}) {
		this.map = new Map();
		this.map.set('eventBus', eventBus);
		this.map.set('dB', dB);
	}

	/**
	 * The global event bus
	 * @type {EventEmitter}
	 */
	get eventBus() {
		return this.map.get('eventBus');
	}

	get dB() {
		return this.map.get('dB');
	}

	toPOJO() {
		return {
			eventBus: this.eventBus,
			DB: this.db
		};
	}
}

export default Registry;
