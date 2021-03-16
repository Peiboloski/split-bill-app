import React, { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../components';
import { CropBillDispatchContext } from '../context/CropBillContext';
import { ROUTES } from '../routes';
import { Main, Section, Title } from './styles';
export default function SelectFilePage(): React.ReactElement {
    const dispatch = useContext(CropBillDispatchContext)!;
    const history = useHistory();
    const inputRef: React.RefObject<HTMLInputElement> = useRef(null);
    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader: FileReader = new FileReader();
            reader.addEventListener('load', () => dispatch({ type: 'setUploadedImage', uploadedImage: reader.result }));
            reader.readAsDataURL(e.target.files[0]);
            history.push(ROUTES.SELECT_PRODUCTS_EXPLANATION);
        }
    };

    return (
        <Main>
            <Section isFileSelect>
                <Title>Upload a picture of your bill</Title>
                <Button onClick={() => inputRef.current!.click()}>Upload file</Button>
                <input
                    ref={inputRef}
                    id="files"
                    style={{ visibility: 'hidden' }}
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                />
            </Section>
        </Main>
    );
}
