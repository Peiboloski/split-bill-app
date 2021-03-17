import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Crop, CropComponent } from '../components';
import { CropBillDispatchContext, CropBillStateContext } from '../context/CropBillContext';
import DoneIcon from '@material-ui/icons/Done';
import { ROUTES } from '../routes';
import { FirebaseContext } from '../firebase';
import { CropButton, Main, Section } from './styles';
import { FullPageSpinner } from '../components/FullPageSpinner';

export enum CropPageColumnsEnum {
    PRODUCTS,
    PRICES,
}
export interface CropPageProps {
    column: CropPageColumnsEnum;
}

export default function CropPage({ column }: CropPageProps): React.ReactElement {
    const history = useHistory();
    const dispatch = useContext(CropBillDispatchContext)!;
    const { uploadedImage, cropArray, endCropping, currentCrop } = useContext(CropBillStateContext)!;
    const firebaseContext = useContext(FirebaseContext);
    const [loading, setLoading] = useState(false);

    const onProductsSelected = () => {
        dispatch({ type: 'pushCurrentCropToCropArray' });
        history.push(ROUTES.SELECT_PRICES_EXPLANATION);
    };

    const onCropFinished = () => {
        dispatch({ type: 'endCropping' });
    };

    const setCurrentCrop = (crop: Crop) => {
        dispatch({ type: 'setCurrentCrop', currentCrop: crop });
    };

    const onEditedImage = (editedImages: HTMLCanvasElement[]) => {
        setLoading(true);
        const productsUrlObject = editedImages[0].toDataURL('image/jpeg', 1).replace('data:image/jpeg;base64,', '');
        const pricesUrlObject = editedImages[1].toDataURL('image/jpeg', 1).replace('data:image/jpeg;base64,', '');
        //TODO: Reduce file quality when image is too big
        firebaseContext.functions
            .httpsCallable('processBillVisionAPI')({
                productsUrlObject: productsUrlObject,
                pricesUrlObject: pricesUrlObject,
            })
            .then((result) => history.push(ROUTES.SPLIT_BILL, result.data));
    };

    const onDoneClicked = column === CropPageColumnsEnum.PRODUCTS ? onProductsSelected : onCropFinished;
    return (
        <Main transparent>
            <Section isCrop>
                <CropComponent
                    uploadedImage={uploadedImage}
                    endCropping={endCropping}
                    onEditedImage={onEditedImage}
                    cropArray={cropArray}
                    currentCrop={currentCrop}
                    setCurrentCrop={setCurrentCrop}
                ></CropComponent>
                <CropButton onClick={onDoneClicked}>
                    <DoneIcon></DoneIcon>
                </CropButton>
            </Section>
            {loading && <FullPageSpinner></FullPageSpinner>}
        </Main>
    );
}
