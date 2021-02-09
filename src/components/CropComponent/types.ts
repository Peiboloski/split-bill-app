export type Crop = {
    unit: '%' | 'px';
    x: number;
    y: number;
    width: number;
    height: number;
    pixelRatio: number;
    scaleX: number;
    scaleY: number;
};

export type InitializeCrop = Partial<Crop>;
