import styled, { css } from 'styled-components';

export const Title = styled.h1`
    font-size: 32px;
    text-align: center;
    margin: 32px;
`;

interface MainProps {
    transparent?: boolean;
}
export const Main = styled.main<MainProps & React.HTMLProps<HTMLElement>>`
    margin: auto;
    max-width: 800px;
    background: ${({ transparent }) => (transparent ? 'transparent' : '#eceff1')};
`;

interface SectionProps {
    isFileSelect?: boolean;
    isCrop?: boolean;
}
export const Section = styled.section<SectionProps & React.HTMLProps<HTMLElement>>`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    ${({ isFileSelect, isCrop }) => {
        if (isFileSelect) {
            return css`
                justify-content: center;
            `;
        }
        if (isCrop) {
            return css`
                width: fit-content;
                margin: auto;
            `;
        }
    }}
`;

export const ExamplePageExample = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: min(90%, 200px);
    margin: 24px auto 12px;
    p {
        text-align: center;
        margin-top: 12px;
        font-size: 14px;
        font-style: italic;
        color: #939ca0;
    }

    img {
        max-width: 100%;
        max-height: 100%;
        height: auto;
        margin: auto;
    }

    @media only screen and (min-width: 600px) {
        width: 250px;
    }
`;

export const ExamplePageContent = styled.div`
    @media only screen and (min-width: 600px) {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
`;

export const CropButton = styled.button`
    background: rgb(14, 110, 102);
    display: block;
    height: 10vh;
    color: white;
`;
