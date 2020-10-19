import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { fetchJson } from "../../api/APIUtils.js";

const BACKEND_HOST = (process.env.REACT_APP_BACKEND_PROTOCOL || 'http') + '://'+ (process.env.REACT_APP_BACKEND_HOST || window.document.location.hostname) + ((process.env.REACT_APP_BACKEND_PORT)? `:${process.env.REACT_APP_BACKEND_PORT}` : '' ) ;
const loadStructure = async (table) => {
	try {
		const respJson = await fetchJson(
			`${BACKEND_HOST}/structure/list/${table}`,
			{
				method: "GET",
				mode: "cors",
				credentials: "include",
				user: { authenticated: true },
			}
		);
        const bootstrapColumns = []; 
        const defaultSorted = [
			{
                dataField: "updateTimestamp",
                order: "desc",
            },
            {
                dataField: "id",
                order: "desc",
            },
		];

		const { columns } = respJson.data;
		if (columns) {
			const columnsSort = columns.sort(function (a, b) {
				return a.order - b.order;
			});

			columnsSort.forEach((el) => {
				const { field, title, type, inputType, hidden, order, ...other } = el;
				let tp = "string";
				if (["string", "number", "bool", "date"].includes(type)) {
					tp = type;
				}


				const pushObj ={
					dataField: field,
					text: title,
					type: tp,
					hidden: (hidden)?hidden:(order < 0),
				}
			 
				// console.log(inputType);
				// console.log(other);
				if(inputType === 'select'){
					if(other?.data?.options){

						pushObj.formatExtraData = other.data.options.reduce(function(result, currentValue) {
							result[currentValue['key']] = currentValue['value'];
							return result;
						}, {});
						pushObj.formatter = (cell, row, rowIndex, formatExtraData) => {
							return (formatExtraData[cell]);
						}


						// formaterFn = () => {
						// 	const formData = other.data.options.reduce(function(result, currentValue) {
						// 		result[currentValue['key']] = currentValue['value']; //a, b, c
						// 		return result;
						// 	  }, {})
						// 	return (cell, row, rowIndex, formatExtraData) => {
						// 		console.log('formData', formData);
						// 		return (
						// 		  <p>sss</p>
						// 		);
						// 	  }
						// };
					}else if(other?.data?.remote){
						pushObj.formatterRelData = other.data.remote;
					}
				}
				/*
					sort: true,
					sortFunc: (a, b, order, dataField, rowA, rowB) => {
						if (order === 'asc') return a - b;
						else return b - a;
					}
				*/

				bootstrapColumns.push(pushObj);
			});
		}

		return { columns: bootstrapColumns, sorted: defaultSorted };
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
    table: PropTypes.string
  };

export default useStructure;