import React, { useCallback, useEffect, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './CropComponent.css';
import type { Crop, InitializeCrop } from './types';

interface CropComponentProps {
    uploadedImage: ArrayBuffer | string | null;
    endCropping: boolean;
    onEditedImage(editedImageArray: HTMLCanvasElement[]): void;
    className?: string;
    cropArray: Crop[];
    currentCrop: Crop | undefined;
    setCurrentCrop(crop: Crop): void;
}
export default function CropComponent({
    uploadedImage,
    endCropping,
    className = '',
    onEditedImage,
    cropArray,
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

        const editedImageArray: HTMLCanvasElement[] = [];

        currentCrop.pixelRatio = window.devicePixelRatio;
        currentCrop.scaleX = image.naturalWidth / image.width;
        currentCrop.scaleY = image.naturalHeight / image.height;
        [...cropArray, currentCrop].forEach((crop: Crop) => {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

            canvas.width = Math.ceil(crop.width! * crop.scaleX * crop.pixelRatio);
            canvas.height = Math.ceil(crop.height! * crop.scaleY * crop.pixelRatio);
            ctx.setTransform(crop.pixelRatio!, 0, 0, crop.pixelRatio!, 0, 0);
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(
                image,
                crop.x * crop.scaleX,
                crop.y * crop.scaleY,
                crop.width! * crop.scaleX,
                crop.height! * crop.scaleY,
                0,
                0,
                crop.width! * crop.scaleX,
                crop.height! * crop.scaleY,
            );
            editedImageArray.push(canvas);
        });

        onEditedImage(editedImageArray);
    }, [endCropping]);

    const onCropComplete = (crop: Crop) => {
        if (image) {
            crop.pixelRatio = window.devicePixelRatio;
            crop.scaleX = image!.naturalWidth / image!.width;
            crop.scaleY = image!.naturalHeight / image!.height;
        }

        setCurrentCrop(crop);
    };

    return (
        <ReactCrop
            key={cropArray.length}
            imageStyle={{ maxWidth: '100%', maxHeight: '90vh' }}
            src={uploadedImage}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(c: Crop) => setCrop(c)}
            onComplete={(c: Crop) => onCropComplete(c)}
            keepSelection
            className={className}
        />
    );
}
