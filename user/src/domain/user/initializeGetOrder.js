/* eslint no-continue: "error" */
export default function initializeGetOrder(sortField, sortOrder) {
	if (!(sortField && typeof sortField === 'string' && sortOrder && typeof sortOrder === 'string')) {
		// return [['updateTimestamp', 'ASC']];
		return [];
	}

	const sortFieldAr = sortField.split(',');
	const sortOrderAr = sortOrder.split(',');

	const orderAr = [];
	for (let index = 0; index < sortFieldAr.length; index += 1) {
		const field = sortFieldAr[index];
		let order = sortOrderAr[index];
		order = order.toUpperCase();

		if (
			field &&
			[
				'id',
				'username',
				'password',
				'fullName',
				'role',
				'status',
				'provider',
				'updateTimestamp'
			].includes(field)
		) {
			if (!(order && (order === 'ASC' || order === 'DESC'))) {
				order = 'DESC';
			}

			orderAr.push([field, order]);
		}
	}
	return orderAr;
}
