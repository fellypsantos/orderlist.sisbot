import React, {useContext} from 'react';
import Select from 'react-select';
import {OrderListContext} from '../../contexts/OrderListContext';

const CustomSelectClothingSize = ({
  value,
  bgColor,
  previewsQuantity,
  theClothingIndex,
  safeClotheName,
  handleChangeClotingSettings,
  handleClearClothingSettings,
}) => {
  const {shouldFilter, clothingSizesDropDown} = useContext(OrderListContext);

  const handleChange = (selectedItem) => {
    if (selectedItem !== null) {
      handleChangeClotingSettings(
        selectedItem.value || null,
        selectedItem.gender,
        // AUTOMATICALLY SET QUANTITY TO 1
        // IF IT'S ZERO WHEN SELECT SOME CLOTHE SIZE
        previewsQuantity === 0 ? 1 : previewsQuantity,
        theClothingIndex,
      );
    } else {
      const theClotheIndex = theClothingIndex - 1;
      handleClearClothingSettings(theClotheIndex);
    }
  };

  const customStyle = {
    control: (styles) => ({
      ...styles,
      backgroundColor: bgColor,
    }),

    option: (styles, {data, isFocused}) => ({
      backgroundColor: isFocused ? '#eee' : data.color,
      padding: 5,
      cursor: 'pointer',
    }),
  };

  return (
    <Select
      isClearable
      options={
        !shouldFilter
          ? clothingSizesDropDown
          : clothingSizesDropDown[safeClotheName]
      }
      value={value}
      onChange={handleChange}
      styles={customStyle}
    />
  );
};

export default CustomSelectClothingSize;
