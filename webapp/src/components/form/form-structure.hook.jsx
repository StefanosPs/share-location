import  { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { fetchJson } from "../../api/APIUtils.js";

const BACKEND_HOST = (process.env.REACT_APP_BACKEND_PROTOCOL || 'http') + '://'+ (process.env.REACT_APP_BACKEND_HOST || window.document.location.hostname) + ((process.env.REACT_APP_BACKEND_PORT)? `:${process.env.REACT_APP_BACKEND_PORT}` : '' ) ;

const loadStructure = async (table) => {
	//TODO add caching
	try {
		const respJson = await fetchJson(
			`${BACKEND_HOST}/structure/table/${table}`,
			{
				method: "GET",
				mode: "cors",
				credentials: "include",
				user: { authenticated: true },
			}
		);
		const bootstrapFields = {};
		const validationObj = {};
		const { fields } = respJson.data;
		if (fields) {
			const fieldsSorted = fields.sort(function (a, b) {
				return a.order - b.order;
			});

			fieldsSorted.forEach((el) => {
				const {
					field,
					title,
					type,
					inputType,
					hidden,
					readOnly,
					readOnlyNewRec,
					required,
					order,
					...other
				} = el;
				let placeholder = "";
				let _type = "string";
				let _readOnlyNewRec = readOnlyNewRec;
				if (["string", "number", "bool", "date"].includes(type)) {
					_type = type;
				}

				if (readOnlyNewRec === undefined) {
					_readOnlyNewRec = readOnly;
				}


				const item = {
					dataField: field,
					title: title,
					type: _type,
					placeholder: placeholder,
					inputType: inputType,
					hidden: (hidden)?hidden:(order < 0),
					readOnly,
					readOnlyNewRec: _readOnlyNewRec,
					required: !!required,
				};


				if(required){
					if(!validationObj[field]) validationObj[field] = {}; 
					validationObj[field]['required'] = required;
				}
				if (inputType === "number") {
					//TODO SETP, Min MAX
				} else if (inputType === "text" || inputType === "password") {
					if (other["minLength"]) {
						if(!validationObj[field]) validationObj[field] = {};
						
						item['minLength'] = other["minLength"];
						validationObj[field]['minLength'] =  other["minLength"];
					}
					if (other["maxLength"]) {
						if(!validationObj[field]) validationObj[field] = {};
						
						item['maxLength'] = other["maxLength"];
						validationObj[field]['maxLength'] =  other["maxLength"];
					}
				} else if (inputType === "select" && other.data ) {
					if (other.data.options) {
						item["options"] = other.data.options;
					}else if(other.data.remote){
						item["remote"] = other.data.remote;
					}
				}

				bootstrapFields[field] = item;
			});
		} 
		//TODO Add validate
		//TODO Add Post/put action

		return { fields: bootstrapFields, validationFields: validationObj };
	} catch (e) {
		console.error(e);
	}
};

const useStructure = (table) => {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState({});

	useEffect(() => {
		const loadProm = loadStructure(table);

		Promise.all([loadProm]).then((respData) => { 
			setData(respData[0]);
			setIsLoading(false);
		});
		return () => {};
	}, [table]);

	return { isLoading, ...data };
};

useStructure.propTypes = {
	table: PropTypes.string.isRequired,
};

export default useStructure;
