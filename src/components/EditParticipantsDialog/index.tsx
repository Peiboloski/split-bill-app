import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Chip,
    DialogTitle,
    DialogContentText,
    InputAdornment,
    IconButton,
} from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import { ParticipantsListComponent, StyledTextField } from './styles';

interface EditParticipantDialogProps {
    participants: string[];
    deleteParticipant: (name: string) => void;
    addParticipant: (name: string) => void;
    onSubmited: () => void;
    open: boolean;
}
export default function EditParticipantsDialog({
    participants,
    deleteParticipant,
    addParticipant,
    onSubmited,
    open,
}: EditParticipantDialogProps): React.ReactElement {
    const [newParticipant, setNewParticipant] = useState<string>('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewParticipant(event.target.value);
    };

    const keyPressed = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            submitNewParticipant();
        }
    };

    const submitNewParticipant = () => {
        if (newParticipant.length > 0 && !newParticipantAlreadyExists) {
            addParticipant(newParticipant);
            setNewParticipant('');
        }
    };

    const newParticipantAlreadyExists = participants.some(
        (participant) => participant.toLowerCase() === newParticipant.toLocaleLowerCase(),
    );
    return (
        <>
            <Dialog
                open={open}
                aria-labelledby="edit-participants-dialog-title"
                aria-aria-describedby="edit-participants-dialog-description"
                fullWidth
            >
                <DialogTitle id="edit-participants-dialog-title">Edit Participants</DialogTitle>
                <DialogContent>
                    <DialogContentText id="edit-participants-dialog-description">
                        Add or remove the people you want to split the bill with.
                    </DialogContentText>
                    <StyledTextField
                        id="add-new-participant-input-container"
                        label={'Add new participant'}
                        variant="outlined"
                        size="small"
                        value={newParticipant}
                        onChange={handleChange}
                        onKeyDown={keyPressed}
                        error={newParticipantAlreadyExists}
                        helperText={newParticipantAlreadyExists ? 'this participant already exist' : ''}
                        inputProps={{
                            maxLength: 20,
                            'aria-label': 'Add new participant',
                            'aria-invalid': newParticipantAlreadyExists,
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        color={'primary'}
                                        disabled={newParticipantAlreadyExists}
                                        size="small"
                                        aria-label="Add Participant"
                                        component="span"
                                        onClick={submitNewParticipant}
                                    >
                                        <AddCircleOutlineOutlinedIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <div
                        id="add-new-participant-input-error"
                        role="status"
                        style={{ width: 0, height: 0, overflow: 'hidden' }}
                    >
                        {newParticipantAlreadyExists && (
                            <span>error: Participant with name {newParticipant} already exists</span>
                        )}
                    </div>
                    <ParticipantsListComponent aria-label="participants list">
                        {participants.map((name: string) => (
                            <li key={name}>
                                <Chip
                                    role="p"
                                    label={name}
                                    onDelete={() => deleteParticipant(name)}
                                    deleteIcon={<CloseIcon role="button" aria-label={'remove' + name} tabIndex={0} />}
                                />
                            </li>
                        ))}
                    </ParticipantsListComponent>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" disabled={participants.length === 0} onClick={onSubmited}>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
