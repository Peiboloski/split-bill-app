import { TextField } from '@material-ui/core';
import styled from 'styled-components';

export const ParticipantsListComponent = styled.ul`
    display: flex;
    flex-wrap: wrap;
    li {
        padding: 0 10px 10px 0;
    }
`;

export const StyledTextField = styled(TextField)`
    && {
        margin: 30px 0 20px;
    }
`;
