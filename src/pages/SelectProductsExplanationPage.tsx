import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../components';
import ProductSelectExample from '../images/ProductSelectExample.jpg';
import { ROUTES } from '../routes';
import { ExamplePageContent, ExamplePageExample, Main, Section, Title } from './styles';
export default function SelectProductsExplanationPage(): React.ReactElement {
    const history = useHistory();

    return (
        <Main>
            <Section>
                <Title>Crop the area with only the list of products</Title>
                <ExamplePageContent>
                    <ExamplePageExample>
                        <img src={ProductSelectExample} alt="Example of product selection" />
                        <p>Example of how to crop the products column</p>
                    </ExamplePageExample>
                    <Button onClick={() => history.push(ROUTES.SELECT_PRODUCTS)}>Crop Products{'   '} ➜</Button>
                </ExamplePageContent>
            </Section>
        </Main>
    );
}
