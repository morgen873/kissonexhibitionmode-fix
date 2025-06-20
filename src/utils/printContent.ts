
export const getPrintContent = () => {
    const printElement = document.getElementById('recipe-label-print');
    return printElement?.innerHTML || '';
};
