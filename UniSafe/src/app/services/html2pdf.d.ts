declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: { scale: number };
    jsPDF?: {
      orientation: string;
      unit: string;
      format: string;
      compressPDF: boolean;
    };
  }

  interface Html2Pdf {
    from: (element: HTMLElement) => Html2Pdf;
    set: (options: Html2PdfOptions) => Html2Pdf;
    save: () => void;
  }

  const html2pdf: () => Html2Pdf;
  export default html2pdf;
}
