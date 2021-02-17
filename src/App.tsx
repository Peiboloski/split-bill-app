import React, { useContext, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { Crop, CropComponent } from './components';
import ProductSelectExample from './images/ProductSelectExample.jpg';
import DoneIcon from '@material-ui/icons/Done';

import { FirebaseContext } from './firebase';

const IMAGE_CROPPING_STEPS = {
    UPLOAD_IMAGE: 'uploadImage',
    SELECT_PRODUCTS_EXPLANATION: 'selectProductExplanation',
    SELECT_PRODUCTS: 'selectProducts',
    SELECT_PRICES_EXPLANATION: 'selectPricesExplanation',
    SELECT_PRICES: 'selectPrices',
};

// Array with the steps values in order
const IMAGE_CROPPING_STEPS_ARRAY = Object.entries(IMAGE_CROPPING_STEPS).map(([, value]) => value);

export default function App(): React.ReactElement {
    const [currentStep, setCurrentStep] = useState(0);
    const [uploadedImage, setUploadedImage] = useState<ArrayBuffer | string | null>(null);
    const [cropArray, setCropArray] = useState<Crop[]>([]);
    const [endCropping, setEndCropping] = useState(false);
    const [currentCrop, setCurrentCrop] = useState<Crop>();

    const firebaseContext = useContext(FirebaseContext);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader: FileReader = new FileReader();
            reader.addEventListener('load', () => setUploadedImage(reader.result));
            reader.readAsDataURL(e.target.files[0]);
            setCurrentStep(currentStep + 1);
        }
    };

    const onProductsSelected = () => {
        setCropArray([...cropArray, { ...currentCrop! }]);
        setCurrentStep(currentStep + 1);
    };

    const onCropFinished = () => {
        setEndCropping(true);
    };

    const onEditedImage = (editedImage: HTMLCanvasElement) => {
        const base64EncodedImage = editedImage.toDataURL('image/jpeg', 1).replace('data:image/jpeg;base64,', '');
        //TODO: Reduce file quality when image is too big
        firebaseContext.functions
            .httpsCallable('processBillVisionAPI')({ fileUrlObject: base64EncodedImage! })
            .then((result) => console.log(result));
    };

    const step = IMAGE_CROPPING_STEPS_ARRAY[currentStep];

    if (step === IMAGE_CROPPING_STEPS.UPLOAD_IMAGE) {
        return (
            <main className="main-select-file">
                <h1>Upload a picture of your bill</h1>
                <label htmlFor="files" className="button">
                    Select Image
                </label>
                <input
                    id="files"
                    style={{ visibility: 'hidden' }}
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                />
            </main>
        );
    }

    if (step === IMAGE_CROPPING_STEPS.SELECT_PRODUCTS_EXPLANATION) {
        return (
            <main className="main-crop-example">
                {<h1>Crop the area with only the list of products</h1>}
                <div className="example-page-content">
                    <div className="example-container">
                        <img className="image" src={ProductSelectExample} alt="Example of product selection" />
                        <p>Example of how to crop the products column</p>
                    </div>
                    <button className="button" onClick={() => setCurrentStep(currentStep + 1)}>
                        Crop Products{'   '} ➜
                    </button>
                </div>
            </main>
        );
    }

    if (step === IMAGE_CROPPING_STEPS.SELECT_PRODUCTS || step === IMAGE_CROPPING_STEPS.SELECT_PRICES) {
        const onDoneClicked = step === IMAGE_CROPPING_STEPS.SELECT_PRODUCTS ? onProductsSelected : onCropFinished;
        return (
            <main className="main-crop-cropping">
                <CropComponent
                    className="crop-component"
                    uploadedImage={uploadedImage}
                    endCropping={endCropping}
                    onEditedImage={onEditedImage}
                    cropArray={cropArray}
                    setCropArray={setCropArray}
                    currentCrop={currentCrop}
                    setCurrentCrop={setCurrentCrop}
                ></CropComponent>
                <button className="finsh-crop-button" onClick={onDoneClicked}>
                    <DoneIcon></DoneIcon>
                </button>
            </main>
        );
    }

    if (step === IMAGE_CROPPING_STEPS.SELECT_PRICES_EXPLANATION) {
        return (
            <main className="main-crop-example">
                {<h1>Crop the area with only the list of Prices</h1>}
                <div className="example-page-content">
                    <div className="example-container">
                        <img className="image" src={ProductSelectExample} alt="Example of prices selection" />
                        <p>Example of how to crop the prices column</p>
                    </div>
                    <button className="button" onClick={() => setCurrentStep(currentStep + 1)}>
                        Crop Prices{'   '} ➜
                    </button>
                </div>
            </main>
        );
    }

    return <></>;
}
