import React, { useCallback, useEffect, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './CropComponent.css';
import type { Crop, InitializeCrop } from './types';

interface CropComponentProps {
    uploadedImage: ArrayBuffer | string | null;
    endCropping: boolean;
    onEditedImage(editedImage: HTMLCanvasElement): void;
    className?: string;
    cropArray: Crop[];
    setCropArray(cropArray: Crop[]): void;
    currentCrop: Crop | undefined;
    setCurrentCrop(crop: Crop): void;
}
export default function CropComponent({
    uploadedImage,
    endCropping,
    className = '',
    onEditedImage,
    cropArray,
    setCropArray,
    currentCrop,
    setCurrentCrop,
}: CropComponentProps): React.ReactElement {
    const [image, setImage] = useState<HTMLImageElement>();
    const [crop, setCrop] = useState<InitializeCrop>({ unit: '%', width: 30, height: 30 });

    const onLoad = useCallback((image) => {
        setImage(image);
    }, []);

    useEffect(() => {
        if (!endCropping || !image || !currentCrop) {
            return;
        }

        const canvas: HTMLCanvasElement = document.createElement('canvas');

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        const pixelRatio = window.devicePixelRatio;

        canvas.width = Math.round(image.width! * pixelRatio);
        canvas.height = Math.round(image.height! * pixelRatio);
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.fillRect(0, 0, image.width * scaleX, image.height * scaleY);
        ctx.imageSmoothingQuality = 'high';

        [...cropArray, currentCrop].forEach((crop: Crop) => {
            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                crop.x,
                crop.y,
                crop.width,
                crop.height,
            );
        });

        onEditedImage(canvas);
        resetComponent();
    }, [endCropping]);

    const resetComponent = () => {
        setCropArray([]);
        setCrop({ unit: '%', width: 30, height: 30, x: 50 });
    };

    return (
        <ReactCrop
            key={cropArray.length}
            imageStyle={{ maxWidth: '100%', maxHeight: '90vh' }}
            src={uploadedImage}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(c: Crop) => setCrop(c)}
            onComplete={(c: Crop) => setCurrentCrop(c)}
            keepSelection
            className={className}
        />
    );
}
