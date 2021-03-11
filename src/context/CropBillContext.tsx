import { Crop } from '../components';

import * as React from 'react';
type Action =
    | {
          type: 'setUploadedImage';
          uploadedImage: State['uploadedImage'];
      }
    | {
          type: 'pushCurrentCropToCropArray';
      }
    | {
          type: 'setCurrentCrop';
          currentCrop: State['currentCrop'];
      }
    | {
          type: 'endCropping';
      };
type Dispatch = (action: Action) => void;
type State = {
    uploadedImage: ArrayBuffer | string | null;
    cropArray: Crop[];
    endCropping: boolean;
    currentCrop: Crop | undefined;
};

export function cropBillCountReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'setUploadedImage': {
            return { ...state, uploadedImage: action.uploadedImage };
        }
        case 'pushCurrentCropToCropArray': {
            return { ...state, cropArray: [...state.cropArray, { ...state.currentCrop! }] };
        }
        case 'setCurrentCrop': {
            return { ...state, currentCrop: action.currentCrop };
        }

        case 'endCropping': {
            return { ...state, endCropping: true };
        }
    }
}

export const cropBillInitialState: State = {
    uploadedImage: null,
    cropArray: [],
    endCropping: false,
    currentCrop: undefined,
};
export const CropBillStateContext = React.createContext<State | undefined>(undefined);
export const CropBillDispatchContext = React.createContext<Dispatch | undefined>(undefined);

interface CropProviderProps {
    children: React.ReactElement;
}
export const CropBillProvider = ({ children }: CropProviderProps): React.ReactElement => {
    const [state, dispatch] = React.useReducer(cropBillCountReducer, cropBillInitialState);
    return (
        <CropBillStateContext.Provider value={state}>
            <CropBillDispatchContext.Provider value={dispatch}>{children}</CropBillDispatchContext.Provider>
        </CropBillStateContext.Provider>
    );
};
