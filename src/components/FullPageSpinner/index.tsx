import { Backdrop, CircularProgress } from '@material-ui/core';
import React from 'react';

export function FullPageSpinner(): React.ReactElement {
    return (
        <Backdrop style={{ zIndex: 100 }} open={true}>
            <CircularProgress></CircularProgress>
        </Backdrop>
    );
}
