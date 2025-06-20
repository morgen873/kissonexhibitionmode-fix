
export const getPrintStyles = () => `
    @page { 
        size: 4in 6in; 
        margin: 0.1in; 
    }
    body { 
        margin: 0; 
        font-family: Arial, sans-serif;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .print-container {
        width: 3.8in;
        height: 5.8in;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 0.3in 0.2in;
        box-sizing: border-box;
        background-color: white;
        color: black;
        text-align: center;
    }
    .title-section {
        flex: 0 0 auto;
        padding-top: 0.1in;
        width: 100%;
    }
    .title-section h4 {
        font-size: 16pt;
        font-weight: bold;
        margin: 0;
        line-height: 1.2;
        word-wrap: break-word;
        hyphens: auto;
    }
    .qr-section {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    .logo-section {
        flex: 0 0 auto;
        padding-bottom: 0.1in;
        width: 100%;
    }
    .logo-section img {
        height: 0.7in;
        width: auto;
        max-width: 100%;
    }
`;
