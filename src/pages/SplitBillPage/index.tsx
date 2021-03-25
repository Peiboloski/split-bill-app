import React, { useEffect, useState } from 'react';
import { EditParticipantsDialog, SplitedBillDialog } from '../../components';
import { Map } from 'immutable';
import { Main, Section, Title } from '../styles';
import { Accordion, AccordionDetails, FormControlLabel, Checkbox, Button as MaterialButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { RouteComponentProps } from 'react-router-dom';
import {
    AccordionDescriptionPrice,
    AccordionDescriptionProduct,
    ProductsAcordionsContainer,
    StyledAccordionDescription,
    AccordionDetailsParticipantsContainer,
    AccordionDetailsParticipant,
    SplitBillActionsContainer,
    TotalPriceHeader,
    TotalPriceContent,
    SplitBillActionContainer,
} from './styles';

type Participant = {
    name: string;
    toPay: number;
};

type ProductParticipant = {
    name: string;
    consumed: boolean;
};

type Product = {
    name: string;
    price: number;
    pricePerParticipant: number;
    participants: Map<string, ProductParticipant>;
};
export default function SplitBillPage({ location }: RouteComponentProps): React.ReactElement {
    const [products, setProducts] = useState<Product[]>([]);

    const [participants, setParticipants] = useState<Map<string, Participant>>(Map({}));
    const [showEditParticipants, setShowEditParticipants] = useState(true);
    const [showSplitedBillDialog, setShowSplitedBillDialog] = useState(false);
    const [accordionExpanded, setAccordionExpanded] = useState<boolean | number>(false);

    //create Product array from input
    useEffect(() => {
        const productsArray: Product[] = [];
        const [receivedProducts, receivedPrices] = location.state as [string[], number[]];
        receivedProducts.forEach((product: string, index: number) =>
            productsArray.push({
                name: product,
                price: receivedPrices[index],
                pricePerParticipant: 0,
                participants: Map<ProductParticipant>({}),
            }),
        );
        setProducts(productsArray);
    }, []);

    //Add/remove participants from Products array when Participants edited
    useEffect(() => {
        if (!products || products.length === 0) {
            return;
        }
        const previousParticipants = products[0].participants;

        //return when there are no new or removed participants
        //this is for situations when an existing participant is edited
        if (previousParticipants.count() === participants.count()) {
            return;
        }
        const newParticipantsKeys = participants.keySeq().filter((key: string) => {
            return !previousParticipants.has(key);
        });
        const deletedParticipantsKeys = previousParticipants.keySeq().filter((key: string) => {
            return !participants.has(key);
        });

        const nextProducts = products.map((product: Product) => {
            let productParticipants = product.participants;
            deletedParticipantsKeys.forEach((deletedKey: string) => {
                productParticipants = productParticipants.remove(deletedKey);
            });
            newParticipantsKeys.forEach((addedKey: string) => {
                productParticipants = productParticipants.set(addedKey, { name: addedKey, consumed: true });
            });
            return {
                ...product,
                participants: productParticipants,
                pricePerParticipant: calculateProductPricePerParticipant(product.price, productParticipants),
            };
        });

        setProducts(nextProducts);
    }, [participants]);

    //Calculate participant cost when product updated
    useEffect(() => {
        if (!products || products.length === 0 || participants.count() === 0) {
            return;
        }

        //Reset toPay to 0 to count again
        const participantsObject = participants
            .map((participant: Participant) => {
                return { ...participant, toPay: 0 };
            })
            .toObject();

        products.forEach((product: Product) => {
            product.participants.forEach((participant: ProductParticipant, key: string) => {
                if (participant.consumed) {
                    participantsObject[key].toPay = participantsObject[key].toPay + product.pricePerParticipant;
                }
            });
        });
        setParticipants(Map(participantsObject));
    }, [products]);

    const deleteParticipant = (key: string): void => {
        setParticipants(participants.delete(key));
    };
    const addParticipant = (key: string): void => {
        setParticipants(participants.set(key, { name: key, toPay: 0 }));
    };

    const handleAccordionChange = (index: number) => (_event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
        setAccordionExpanded(isExpanded ? index : false);
    };

    const handleProductParticipantCheckboxChange = (participantKey: string, productIndex: number) => (
        _event: React.ChangeEvent<unknown>,
        checked: boolean,
    ) => {
        const changedProductParticipant = products[productIndex].participants.get(participantKey)!;
        changedProductParticipant!.consumed = checked;
        const newProductsArray = products.map((product: Product, index: number) => {
            const participants = Map(product.participants);
            if (productIndex === index) {
                participants.set(participantKey, changedProductParticipant);
            }
            return {
                ...product,
                participants: participants,
                pricePerParticipant: calculateProductPricePerParticipant(product.price, participants),
            };
        });

        setProducts(newProductsArray);
    };

    const calculateProductPricePerParticipant = (price: number, participants: Map<string, ProductParticipant>) => {
        let numberOfParticipantsConsuming = 0;
        participants.forEach((participant: ProductParticipant) => {
            if (participant.consumed) {
                numberOfParticipantsConsuming = numberOfParticipantsConsuming + 1;
            }
        });

        return price / numberOfParticipantsConsuming;
    };

    const participantsName = participants.keySeq().toArray();
    const [, pricesArray] = location.state as [string[], number[]];
    const totalPrice = pricesArray.reduce((accumulator: number, value: number) => accumulator + value, 0).toFixed(2);
    return (
        <>
            <Main>
                <Section>
                    <Title>Split the bill</Title>
                    <SplitBillActionsContainer>
                        <SplitBillActionContainer>
                            <TotalPriceHeader>TOTAL</TotalPriceHeader>{' '}
                            <TotalPriceContent>{totalPrice + ' €'}</TotalPriceContent>
                        </SplitBillActionContainer>
                        <SplitBillActionContainer>
                            <MaterialButton
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginBottom: '12px' }}
                                onClick={() => {
                                    setShowSplitedBillDialog(true);
                                }}
                            >
                                See splitted bill
                            </MaterialButton>
                            <MaterialButton
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={() => {
                                    setShowEditParticipants(true);
                                }}
                            >
                                Edit Participants
                            </MaterialButton>
                        </SplitBillActionContainer>
                    </SplitBillActionsContainer>
                    <ProductsAcordionsContainer>
                        {products.map((product: Product, productIndex: number) => {
                            return (
                                <Accordion
                                    key={productIndex}
                                    square
                                    component="li"
                                    onChange={handleAccordionChange(productIndex)}
                                    expanded={accordionExpanded === productIndex}
                                    elevation={1}
                                    aria-labelby={'bill-product-description' + product.name}
                                    style={{ margin: '10px', borderRadius: '4px', border: 'none' }}
                                >
                                    <StyledAccordionDescription
                                        id={'bill-product-description' + product.name}
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <div>
                                            <AccordionDescriptionProduct>{product.name}</AccordionDescriptionProduct>
                                            <AccordionDescriptionPrice>
                                                {product.price + ' €'}
                                            </AccordionDescriptionPrice>
                                        </div>
                                    </StyledAccordionDescription>
                                    <AccordionDetails>
                                        <AccordionDetailsParticipantsContainer>
                                            {product.participants
                                                .toArray()
                                                .map(([name, participant]: [string, ProductParticipant]) => (
                                                    <AccordionDetailsParticipant key={name}>
                                                        <FormControlLabel
                                                            aria-label={name + 'has consumed' + product.name}
                                                            checked={participant.consumed}
                                                            onChange={handleProductParticipantCheckboxChange(
                                                                name,
                                                                productIndex,
                                                            )}
                                                            control={<Checkbox color="primary" />}
                                                            label={participant.name}
                                                        />
                                                        <div>
                                                            {(participant.consumed ? product.pricePerParticipant : 0) +
                                                                ' €'}
                                                        </div>
                                                    </AccordionDetailsParticipant>
                                                ))}
                                        </AccordionDetailsParticipantsContainer>
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </ProductsAcordionsContainer>
                </Section>
            </Main>
            <EditParticipantsDialog
                participants={participantsName}
                deleteParticipant={deleteParticipant}
                addParticipant={addParticipant}
                open={showEditParticipants}
                onSubmited={() => setShowEditParticipants(false)}
            ></EditParticipantsDialog>
            <SplitedBillDialog
                open={showSplitedBillDialog}
                participants={participants.toArray().map(([, participant]) => {
                    return { name: participant.name, toPay: participant.toPay };
                })}
                onSubmited={() => setShowSplitedBillDialog(false)}
            ></SplitedBillDialog>
        </>
    );
}
