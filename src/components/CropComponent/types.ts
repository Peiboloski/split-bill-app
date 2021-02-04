export type Crop = {
    unit: '%' | 'px';
    x: number;
    y: number;
    width: number;
    height: number;
};

export type InitializeCrop = Partial<Crop>;
