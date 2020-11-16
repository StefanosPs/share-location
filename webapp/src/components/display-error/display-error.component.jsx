import React from 'react';

import { Alert } from 'react-bootstrap';

const DisplayError = ({ children, ...props }) => {
    <Alert variant="danger" dismissible>
        {children}
    </Alert>
};

export default DisplayError;