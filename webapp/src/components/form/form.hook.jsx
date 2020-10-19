import { useState, useEffect } from "react";

const useForm = (callback, validate, initValues) => {
	const [values, setValues] = useState(initValues);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (Object.keys(errors).length === 0 && isSubmitting) {
			callback()
				.catch((er) => console.log(er))
				.finally(() => {
					setIsSubmitting(false);
				});
		}
		return () => {};
	}, [errors, callback, isSubmitting]);
	// callback
	const handleSubmit = (event) => {
		if (event) event.preventDefault();
		setErrors(validate(values));
		setIsSubmitting(true);
	};

	const handleChange = (event, targetName, targetValue) => {
		if (event) event.persist();
		const name = event?.target?.name ? event.target.name : targetName;
		const value = event?.target?.value ? event.target.value : targetValue;
		if (values[name] !== value) {
			setValues((values) => ({
				...values,
				[name]: value,
			}));
		}
	};

	return {
		handleChange,
		handleSubmit,
		values,
		errors,
	};
};
export default useForm;
