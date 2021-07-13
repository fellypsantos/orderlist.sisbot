export default {
  DownloadTextFile: (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },

  CalculatePaymentValueToOrderItem: (
    currentPrices,
    orderItemClothingSettings,
  ) => {
    // CONTERT PRICES TO ARRAY
    const pricesList = [
      ...currentPrices.map((priceItem) => {
        const thePrice = priceItem.price === '' ? 0 : parseInt(priceItem.price);
        return thePrice;
      }),
    ];

    let totalPrice = 0;

    // SUM THE PRICES
    orderItemClothingSettings.map((item) => {
      totalPrice += item.quantity * pricesList[item.id - 1];
      return item;
    });

    return totalPrice;
  },

  Sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  StyleHelper: {
    TextAlign: (value) => ({textAlign: `${value}`}),
    MaxWidthinPixels: (value) => ({maxWidth: `${value}px`}),
  },
};
