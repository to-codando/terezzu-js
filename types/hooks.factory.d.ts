export function hooksFactory(): {
    beforeOnRender: (callback: any) => void;
    afterOnRender: (callback: any) => void;
    onInit: (callback: any) => void;
    emit: (eventName: any, payload: any) => void;
};
