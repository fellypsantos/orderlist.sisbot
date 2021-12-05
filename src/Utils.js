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
  ) => {
    if (currentPrices === null) return false;

    // console.warn('* * * CONFERÊNCIA * * *');
    // console.log('currentPrices', currentPrices);
    // console.log('clothingSizes', clothingSizes);
    // console.log('orderItemClothingSettings', orderItemClothingSettings);
    // // console.log('genderPriceTable', genderPriceTable);
    // console.warn('* * * CONFERÊNCIA FINALIZADA * * *');

    // CONVERT PRICES TO ARRAY
    const convertPriceTableToArray = (arrTarget) =>
      Object.keys(arrTarget).map(
        (clothePriceListItem) => arrTarget[clothePriceListItem],
      );

    const arrPriceTable = {
      male: convertPriceTableToArray(currentPrices.priceTableMale),
      female: convertPriceTableToArray(currentPrices.priceTableFemale),
      childish: convertPriceTableToArray(currentPrices.priceTableChildish),
    };

    let totalPrice = 0;

    // SUM THE PRICES
    orderItemClothingSettings.map((item) => {
      const result =
        clothingSizes.find((theSize) => theSize.value === item.size) || null;

      if (result === null) return false;

      const clotheID = item.id - 1;
      const selectedPriceList =
        arrPriceTable[item.gender.toLowerCase()][clotheID];

      const subtractionValue = result.gender === 'CHILDISH' ? 10 : 1;
      const pricePerSize = selectedPriceList[result.id - subtractionValue];

      totalPrice += pricePerSize * item.quantity;
      return item;
    });
    return totalPrice;
  },

  GetTotalColumnsTableOrderListItems: (tableElement) => {
    if (tableElement !== null) {
      const columnCount = tableElement.children[0].children[2].children.length;
      return columnCount;
    }

    return 13; // default
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

  IsValidEmail: (email) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),

  HelperCountTotalOfPieces: (orderListItems, returnTotalOnly = false) => {
    const calculator = {
      tshirt: 0,
      tshirtLong: 0,
      shorts: 0,
      pants: 0,
      tanktop: 0,
      vest: 0,
    };

    orderListItems.map((orderItem) => {
      orderItem.clothingSettings.map((theClothe) => {
        const clotheName = theClothe.name.replace('Cycling', '');
        const clotheQty = theClothe.quantity;

        calculator[clotheName] += clotheQty; // CALCULATE
      });
    });

    // RETURN OBJECT WITH SUM VALUES OR TOTAL OF EVERYTHING
    const valueToReturn = returnTotalOnly
      ? Object.values(calculator).reduce((a, b) => a + b)
      : calculator;

    return valueToReturn;
  },

  ParseGenderToIndex: (theGender) => {
    if (theGender === 'MALE') return 0;
    if (theGender === 'FEMALE') return 1;
    if (theGender === 'CHILDISH') return 2;
  },
};
