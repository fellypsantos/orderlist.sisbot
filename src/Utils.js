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

  GetTotalColumnsTableOrderListItems: (tableElement) => {
    if (tableElement !== null) {
      const columnCount = tableElement.children[0].children[1].children.length;
      return columnCount;
    }

    return 0;
  },

  Sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  HandleUploadFile: (fileExtension, callback) => {
    const inputFileChooser = document.createElement('input');
    inputFileChooser.setAttribute('type', 'file');
    inputFileChooser.setAttribute('accept', fileExtension);
    inputFileChooser.setAttribute('className', 'd-none');
    inputFileChooser.onchange = (e) => {
      // READ CONTENT
      const fileReader = new FileReader();
      const {files} = e.target;

      if (files && files[0]) {
        fileReader.onload = (el) => {
          const {result} = el.target;
          callback(result);
        };

        fileReader.readAsText(e.target.files[0]);
      }
    };

    inputFileChooser.click();
  },
};
