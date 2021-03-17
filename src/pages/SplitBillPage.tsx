import React, { useState } from 'react';
import { EditParticipantsDialog } from '../components';
import { Map } from 'immutable';
//import { RouteComponentProps } from 'react-router-dom';

type Participant = {
    name: string;
};
export default function SplitBillPage(): React.ReactElement {
    //const [products, prices] = location.state as [string[], number[]];

    const [participants, setParticipants] = useState<Map<string, Participant>>(
        Map({
            Juan: { name: 'Juan' },
            Paco: { name: 'Paco' },
        }),
    );
    const [showEditParticipants, setShowEditParticipants] = useState(true);
    const deleteParticipant = (key: string): void => {
        setParticipants(participants.delete(key));
    };
    const addParticipant = (key: string): void => {
        setParticipants(participants.set(key, { name: key }));
    };

    const participantsName = participants.keySeq().toArray();
    return (
        <>
            (
            <EditParticipantsDialog
                participants={participantsName}
                deleteParticipant={deleteParticipant}
                addParticipant={addParticipant}
                open={showEditParticipants}
                onSubmited={() => setShowEditParticipants(false)}
            ></EditParticipantsDialog>
            )
        </>
    );
}
