import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface Crop {
    unit: '%' | 'px';
    x: number;
    y: number;
    width: number;
    height: number;
}
type InitializeCrop = Partial<Crop>;

function generateDownload(canvas: HTMLCanvasElement, crop: Crop) {
    if (!crop || !canvas) {
        return;
    }

    canvas.toBlob(
        (blob: unknown) => {
            const previewUrl = window.URL.createObjectURL(blob);

            const anchor = document.createElement('a');
            anchor.download = 'cropPreview.png';
            anchor.href = URL.createObjectURL(blob);
            anchor.click();

            window.URL.revokeObjectURL(previewUrl);
        },
        'image/png',
        1,
    );
}

export default function App(): React.ReactElement {
    const [upImg, setUpImg] = useState<ArrayBuffer | string | null>();
    const [image, setImage] = useState<HTMLImageElement>();
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState<InitializeCrop>({ unit: '%', width: 30, height: 30 });
    const [currentCrop, setCurrentCrop] = useState<Crop>();
    const [cropArray, setCropArray] = useState<Crop[]>([]);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader: FileReader = new FileReader();
            reader.addEventListener('load', () => setUpImg(reader.result));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const initiateNewCrop = () => {
        setCropArray([...cropArray, { ...currentCrop! }]);
        setCrop({ unit: '%', width: 30, height: 30, x: 50 });
    };

    const onLoad = useCallback((img) => {
        setImage(img);
    }, []);

    useEffect(() => {
        if (!currentCrop || !previewCanvasRef.current || !image) {
            return;
        }

        const canvas: HTMLCanvasElement = previewCanvasRef.current!;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        const pixelRatio = window.devicePixelRatio;

        canvas.width = Math.round(image.width! * pixelRatio);
        canvas.height = Math.round(image.height! * pixelRatio);
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.fillRect(0, 0, image.width * scaleX, image.height * scaleY);
        ctx.imageSmoothingQuality = 'high';

        cropArray.forEach((crop: Crop) => {
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
    }, [cropArray, image]);

    return (
        <div className="App">
            <div>
                <input type="file" accept="image/*" onChange={onSelectFile} />
            </div>
            <div className="react-crop-container">
                <ReactCrop
                    key={cropArray.length}
                    imageStyle={{ maxWidth: '100%', maxHeight: '80vh' }}
                    src={upImg}
                    onImageLoaded={onLoad}
                    crop={crop}
                    onChange={(c: Crop) => setCrop(c)}
                    onComplete={(c: Crop) => setCurrentCrop(c)}
                />
            </div>
            <div>
                <canvas
                    ref={previewCanvasRef}
                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                    style={{
                        width: Math.round(image?.width ?? 0),
                        height: Math.round(image?.height ?? 0),
                    }}
                />
            </div>
            <button
                type="button"
                disabled={!(currentCrop && (currentCrop.width || currentCrop.height))}
                onClick={() => initiateNewCrop()}
            >
                Select Prices
            </button>
            <button
                type="button"
                disabled={!(currentCrop && (currentCrop.width || currentCrop.height))}
                onClick={() => generateDownload(previewCanvasRef.current!, currentCrop!)}
            >
                Download cropped image
            </button>
        </div>
    );
}
