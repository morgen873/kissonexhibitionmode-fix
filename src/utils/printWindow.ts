
import { getPrintStyles } from './printStyles';

export const createPrintWindow = (content: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return null;

    const htmlContent = `
        <html>
            <head>
                <title>Print Recipe</title>
                <style>${getPrintStyles()}</style>
            </head>
            <body>${content}</body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    return printWindow;
};

export const executePrint = (printWindow: Window) => {
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
};
