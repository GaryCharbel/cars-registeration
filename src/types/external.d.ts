declare module 'arabic-reshaper' {
    const ArabicReshaper: {
        reshape: (text: string) => string;
    };
    export default ArabicReshaper;
}

declare module 'bidi-js' {
    interface Bidi {
        getReorderedText: (text: string) => string;
    }
    const bidiFactory: () => Bidi;
    export default bidiFactory;
}
