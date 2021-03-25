import { AccordionSummary } from '@material-ui/core';
import styled from 'styled-components';

export const StyledAccordionDescription = styled(AccordionSummary)`
    && {
    }
`;

export const AccordionDetailsParticipantsContainer = styled.div`
    && {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
`;
export const AccordionDescriptionProduct = styled.p`
    font-size: 16px;
    font-weight: normal;
    text-transform: uppercase;
    margin-bottom: 6px;
`;

export const AccordionDescriptionPrice = styled.p`
    font-size: 14px;
    font-weight: lighter;
    color: #747272;
`;

export const ProductsAcordionsContainer = styled.ul`
    width: min(100%, 400px);
    margin: 0 auto;
`;

export const AccordionDetailsParticipant = styled.div`
    display: flex;
    justify-content: space-between;
    div {
        margin: auto 0;
    }
`;

export const SplitBillActionsContainer = styled.div`
    z-index: 100;
    width: min(100%, 400px);
    margin: 20px auto;
    padding: 20px;
    box-sizing: border-box;
    top: 0;
    position: sticky;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    background: #e0e0e0;
`;

export const SplitBillActionContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const TotalPriceHeader = styled.div`
    font-size: 14px;
    letter-spacing: 4px;
    color: #757575;
    padding-bottom: 6px;
`;

export const TotalPriceContent = styled.div``;
