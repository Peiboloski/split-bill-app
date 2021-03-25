import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@material-ui/core';
import React from 'react';

interface SplitedBillDialogProps {
    participants: { name: string; toPay: number }[];
    onSubmited: () => void;
    open: boolean;
}
export default function SplitedBillDialog({
    participants,
    onSubmited,
    open,
}: SplitedBillDialogProps): React.ReactElement {
    return (
        <>
            <Dialog
                open={open}
                aria-labelledby="splited-bill-dialog-title"
                fullWidth
                scroll={'body'}
            >
                <DialogTitle id="splited-bill-dialog-title">Splited Bill</DialogTitle>
                <DialogContent>
                    <DialogContentText component='ul'>
                        {participants.map((participant) => {
                            return (
                                <li key={participant.name}>
                                    {participant.name + ' ' + participant.toPay.toFixed(2) + ' €'}
                                </li>
                            );
                        })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={onSubmited}>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
