import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { fetchJson } from "../../../../api/APIUtils";

const BACKEND_HOST =
	(process.env.REACT_APP_BACKEND_PROTOCOL || "http") +
	"://" +
	(process.env.REACT_APP_BACKEND_HOST || window.document.location.hostname) +
	(process.env.REACT_APP_BACKEND_PORT
		? `:${process.env.REACT_APP_BACKEND_PORT}`
		: "");
const FormSelect = ({
	element,
	title,
	type,
	name,
	values,
	handleChange,
	readOnly,
	error,
	relData,
	...props
}) => {
	
	const [select, setSelect] = useState({
		value: values[name],
		options: [],
	});

	useEffect(() => {
		if (element.remote) {
			const keyField = element.remote.keyField ? element.remote.keyField : "id";
			const valueField = element.remote.valueField
				? element.remote.valueField
				: "value";
			const tmpData = relData ? relData[element.remote.table] : {};
			const temp = tmpData.find((element) => element[keyField] === select.value);
			if (temp){
				setSelect((prevState) => { 
					return {
						...prevState, 
						options: [{
							id: temp[keyField],
							value: temp[valueField],
						}]
					};
				});
			}

			if (!readOnly) {
				const { url, urlParams } = element.remote;
				// console.log("url", url);
				// console.log("urlParams", urlParams);

				const params =
					urlParams && typeof urlParams.params === "object"
						? { ...urlParams.params }
						: {};
				if (urlParams && urlParams.functions) {
					for (const property in urlParams.functions) {
						try {
							const fn = new Function(
								"params",
								"values",
								urlParams.functions[property]
							);
							fn(params, values);
						} catch (error) {
							console.error(error);
						}
					}
				}
				let getParams = "?";
				if (params) {
					getParams += new URLSearchParams(params);
				}
				fetchJson(`${BACKEND_HOST}${url}${getParams}`, {
					method: "GET",
					mode: "cors",
					credentials: "include",
					user: { authenticated: true },
				}).then(({ statusCode, data }) => {
					if (statusCode === 200) {
						const newOptArray = data.map((temp) => ({
							id: temp[keyField],
							value: temp[valueField],
						}));
						const options = [
							...select.options,
							...newOptArray
						]
						const value = (select.value)? select.value:  options[0].id;
						handleChange(undefined , name , value);
						setSelect((prevState) => {
							return {
								...prevState,
								value,
								options
							};
						});
						 
					}
				});
			}
		} else {
			setSelect((prevState) => {
				const value = (prevState.value)? prevState.value:  element.options[0].key;
				handleChange(undefined , name , value);
				return {
					...prevState,
					value,
					options: element.options.map((subEl) => ({
						id: subEl.key,
						value: subEl.value,
					})),
				};
			});
		}
		
		return () => {};
	}, []);
	const optionTemplate = select.options.map((el) => (
		<option key={`key-${name}-${el.id}`} value={el.id}>
			{el.value}
		</option>
	));

	return (
		<>
			<Form.Label>{title}</Form.Label>
			<Form.Control
				as="select"
				type={type}
				value={select.value}
				onChange={handleChange}
				readOnly={readOnly}
				name={name}
				isInvalid={!!error}
			>
				{optionTemplate}
			</Form.Control>
			<Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
		</>
	);
};

export default FormSelect;
/**
 {options &&
    options.map((el) => {
        console.log(el);
        return (
            <option key={`optkey-${name}-${el.id}`} value={el.id}>
                {el.value}
            </option>
        );
    })}
 */
