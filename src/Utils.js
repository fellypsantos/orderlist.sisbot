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
    clothingSizes,
    orderItemClothingSettings,
    genderPriceTable,
  ) => {
    if (currentPrices === null) return false;

    let targetPriceTable;

    // console.warn('* * * CONFERÊNCIA * * *');
    // console.log('currentPrices', currentPrices);
    // console.log('clothingSizes', clothingSizes);
    // console.log('orderItemClothingSettings', orderItemClothingSettings);
    // console.log('genderPriceTable', genderPriceTable);
    // console.warn('* * * CONFERÊNCIA FINALIZADA * * *');

    switch (genderPriceTable) {
      case 'MALE':
        // console.log('selected: priceTableMale');
        targetPriceTable = currentPrices.priceTableMale;
        break;
      case 'FEMALE':
        // console.log('selected: priceTableFemale');
        targetPriceTable = currentPrices.priceTableFemale;
        break;
      case 'CHILDISH':
        // console.log('selected: priceTableChildish');
        targetPriceTable = currentPrices.priceTableChildish;
        break;
      default:
    }

    // CONVERT PRICES TO ARRAY
    const pricesList = Object.keys(targetPriceTable).map(
      (clothePriceListItem) => targetPriceTable[clothePriceListItem],
    );

    let totalPrice = 0;

    // SUM THE PRICES
    orderItemClothingSettings.map((item) => {
      const result =
        clothingSizes.find((theSize) => theSize.code === item.size) || null;

      if (result === null) return false;

      const clotheID = item.id - 1;
      const selectedPriceList = pricesList[clotheID];
      const pricePerSize = selectedPriceList[result.id - 1];

      totalPrice += pricePerSize * item.quantity;
      return item;
    });

    return totalPrice;
  },

  GetTotalColumnsTableOrderListItems: (tableElement) => {
    if (tableElement !== null) {
      const columnCount = tableElement.children[0].children[1].children.length;
      return columnCount;
    }

    return 13; // default
  },

  Sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  GetBaseName: (whileInDev, whileInProd) =>
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      ? whileInDev
      : whileInProd,

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

        if (fileExtension.includes('image')) {
          fileReader.readAsDataURL(e.target.files[0]);
        } else {
          fileReader.readAsText(e.target.files[0]);
        }
      }
    };

    inputFileChooser.click();
  },

  GetPriceTableByGender: (priceTables, gender) => {
    let targetPriceTable = null;

    switch (gender) {
      case 'MALE':
        targetPriceTable = priceTables.priceTableMale;
        break;
      case 'FEMALE':
        targetPriceTable = priceTables.priceTableFemale;
        break;
      case 'CHILDISH':
        targetPriceTable = priceTables.priceTableChildish;
        break;
      default:
    }

    return targetPriceTable;
  },
};
