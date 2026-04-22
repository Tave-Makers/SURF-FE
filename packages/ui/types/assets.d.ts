declare module '*.png' {
  const content: import('next/image').StaticImageData;
  export default content;
}

declare module '*.svg' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
