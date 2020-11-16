/* eslint-disable no-restricted-syntax */
const validFieldName = fieldName => {
	if (fieldName && ['id', 'watcherUserId', 'observeUserId', 'status'].includes(fieldName)) {
		return true;
	}

	return false;
};

export default function initializeFilters(filters) {
	const retObj = {};
	if (typeof filters !== 'object') return {};

	if (!filters) return {};

	if (filters.and) {
		const filterAnd = filters.and.filter(obj => {
			for (const key in obj) {
				if (validFieldName(key)) {
					console.log(key, obj[key]);
					return true;
				}
			}
			return false;
		});
		retObj.and = filterAnd;
	}
	if (filters.or) {
		const filterOr = filters.or.filter(obj => {
			for (const key in obj) {
				if (validFieldName(key)) {
					console.log(key, obj[key]);
					return true;
				}
			}
			return false;
		});
		retObj.or = filterOr;
	}
	return { ...retObj };
}
