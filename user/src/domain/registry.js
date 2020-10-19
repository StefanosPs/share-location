/**
 * A registry of dependencies that provides the app
 * with a very primitive DI mechanism.
 */
class Registry {
	constructor({eventBus, dB, dictionary}) {
		this.map = new Map();
		this.map.set('eventBus', eventBus);
		this.map.set('dB', dB);
		this.map.set('dictionary', dictionary);
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
	// get dictionary() {
	// 	return this.map.get('dictionary');
	// }
	// set Lang(lang){

	// }

	toPOJO() {
		return {
			eventBus: this.eventBus,
			DB: this.db,
			dictionary: this.dictionary
		};
	}
}

export default Registry;
