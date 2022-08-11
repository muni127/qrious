// Stop eslint from complaining about SVG file extensions
declare module '*.svg' {
    const content: any;
    export default content;
}
