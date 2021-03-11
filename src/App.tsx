import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import { ROUTES } from './routes';
import { CropBillProvider } from './context/CropBillContext';
import {
    CropPage,
    CropPageColumnsEnum,
    SelectFilePage,
    SelectPricesExplanationPage,
    SelectProductsExplanationPage,
} from './pages';

export default function App(): React.ReactElement {
    return (
        <CropBillProvider>
            <Router>
                <Switch>
                    <Route path={ROUTES.SELECT_FILE}>
                        <SelectFilePage></SelectFilePage>
                    </Route>
                    <Route path={ROUTES.SELECT_PRODUCTS_EXPLANATION}>
                        <SelectProductsExplanationPage></SelectProductsExplanationPage>
                    </Route>
                    <Route path={ROUTES.SELECT_PRODUCTS}>
                        <CropPage column={CropPageColumnsEnum.PRODUCTS}></CropPage>
                    </Route>
                    <Route path={ROUTES.SELECT_PRICES_EXPLANATION}>
                        <SelectPricesExplanationPage></SelectPricesExplanationPage>
                    </Route>
                    <Route path={ROUTES.SELECT_PRICES}>
                        <CropPage column={CropPageColumnsEnum.PRICES}></CropPage>
                    </Route>
                    <Route path={'/'}>
                        <Redirect to={ROUTES.SELECT_FILE}></Redirect>
                    </Route>
                </Switch>
            </Router>
        </CropBillProvider>
    );
}
