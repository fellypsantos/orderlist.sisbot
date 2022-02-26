import React, {useContext, useEffect, useState, useCallback} from 'react';
import Cropper from 'react-easy-crop';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import RangeSlider from 'react-bootstrap-range-slider';

import moment from 'moment';
import 'moment/min/locales';
import {OrderListContext} from '../../contexts/OrderListContext';

import TableContentCentered from '../../components/TableContentCentered';
import PenField from '../../components/PenField';
import ReportHeader from '../../components/ReportHeader';
import ReportMenu from '../../components/ReportMenu';
import {ReportContext} from '../../contexts/ReportContext';
import Utils from '../../Utils';
import DateTimePickerCustom from '../../components/DateTimePickerCustom';

const Report = () => {
  const {
    orderListItems,
    orderListItemsNotes,
    setOrderListItemsNotes,
    clothingIcons,
    clothingSizes,
    Translator,
    isCycling,
  } = useContext(OrderListContext);

  const {modalImageSelection, setModalVisibleImageSelection} =
    useContext(ReportContext);

  const INITIAL_STATE_SORTED_ORDER_LIST = {
    male: {
      tshirt: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      tshirtLong: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      shorts: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      pants: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      tanktop: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      vest: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
    },
    female: {
      tshirt: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      tshirtLong: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      shorts: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      pants: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      tanktop: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      vest: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
    },
    childish: {
      tshirt: {
        'T-2A': 0,
        'T-4A': 0,
        'T-6A': 0,
        'T-8A': 0,
        'T-10A': 0,
        'T-12A': 0,
        'T-14A': 0,
        'T-16A': 0,
      },
      tshirtLong: {
        'T-2A': 0,
        'T-4A': 0,
        'T-6A': 0,
        'T-8A': 0,
        'T-10A': 0,
        'T-12A': 0,
        'T-14A': 0,
        'T-16A': 0,
      },
      shorts: {
        'T-2A': 0,
        'T-4A': 0,
        'T-6A': 0,
        'T-8A': 0,
        'T-10A': 0,
        'T-12A': 0,
        'T-14A': 0,
        'T-16A': 0,
      },
      pants: {
        'T-2A': 0,
        'T-4A': 0,
        'T-6A': 0,
        'T-8A': 0,
        'T-10A': 0,
        'T-12A': 0,
        'T-14A': 0,
        'T-16A': 0,
      },
      tanktop: {
        'T-2A': 0,
        'T-4A': 0,
        'T-6A': 0,
        'T-8A': 0,
        'T-10A': 0,
        'T-12A': 0,
        'T-14A': 0,
        'T-16A': 0,
      },
      vest: {
        'T-2A': 0,
        'T-4A': 0,
        'T-6A': 0,
        'T-8A': 0,
        'T-10A': 0,
        'T-12A': 0,
        'T-14A': 0,
        'T-16A': 0,
      },
    },
  };

  // TRANSLATE MOMENTJS FORMAT
  moment.locale(Translator('MOMENTJS'));

  const [useCrop, setUseCrop] = useState(false);
  const [crop, setCrop] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [scale, setScale] = useState(50);
  const [croppedArea, setCroppedArea] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [finalProcessedImage, setFinalProcessedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [consolidatedCounting, setConsolidatedCounting] = useState(null);

  // HEADER STATES
  const [serviceOrder, setServiceOrder] = useState('');
  const [clientName, setClientName] = useState('');
  const [responsableName, setResponsableName] = useState('');
  const [orderDate, setOrderDate] = useState(moment());
  const [deliveryDate, setDeliveryDate] = useState(null);

  const [sortedOrderList, setSortedOrderList] = useState(
    JSON.parse(JSON.stringify(INITIAL_STATE_SORTED_ORDER_LIST)),
  );

  const isEmptyClothingSettings = (clothingSettings) => {
    if (clothingSettings === undefined) return false;

    let totalPieces = 0;
    Object.keys(clothingSettings).map((key) => {
      totalPieces += clothingSettings[key];
      return key;
    });

    return totalPieces === 0;
  };

  const isEmptyClothingWithSize = (sortedItems, sizeToCheck) => {
    let totalPieces = 0;

    Object.keys(sortedItems).map((clotheName) => {
      Object.keys(sortedItems[clotheName]).map((innerKey) => {
        if (innerKey === sizeToCheck) {
          totalPieces += sortedItems[clotheName][innerKey];
        }
        return innerKey;
      });
      return clotheName;
    });

    return totalPieces === 0;
  };

  // CALCULATE DATA TO FILL TABLES
  useEffect(() => {
    // INITIALIZE IT ONCE, AND FILL WITH ITERATIONS DOWN BELOW
    const tempSortedOrderList = JSON.parse(
      JSON.stringify(INITIAL_STATE_SORTED_ORDER_LIST),
    );

    // PROCESS THE CLOTHES
    orderListItems.map((orderItem) => {
      orderItem.clothingSettings.map((theClothe) => {
        if (theClothe.quantity > 0 && theClothe.size !== '') {
          const tempGender = theClothe.gender.toLowerCase();
          const clotheName = theClothe.name.replace('Cycling', '');
          const clotheSize = theClothe.size;
          const clotheQty = theClothe.quantity;

          tempSortedOrderList[tempGender][clotheName][clotheSize] += clotheQty;
        }
        return theClothe;
      });
      return orderItem;
    });

    setSortedOrderList(tempSortedOrderList);

    // LOAD CONSOLIDATED VALUES AS OBJECT
    const calculated = Utils.HelperCountTotalOfPieces(orderListItems);
    setConsolidatedCounting(calculated);
  }, [orderListItems]);

  const handleCloseModal = () => {
    setModalVisibleImageSelection(false);
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleApplyCrop = () => {
    const canvas = document.createElement('canvas');
    canvas.width = croppedArea.width / 2;
    canvas.height = croppedArea.height / 2;
    const canvasContext = canvas.getContext('2d');
    const imageObj = new Image();

    imageObj.onload = () => {
      const sourceX = croppedArea.x;
      const sourceY = croppedArea.y;
      const sourceWidth = croppedArea.width;
      const sourceHeight = croppedArea.height;
      const destWidth = canvas.width;
      const destHeight = canvas.height;
      const destX = 0;
      const destY = 0;

      // Draw Cropped Image
      canvasContext.drawImage(
        imageObj,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destX,
        destY,
        destWidth,
        destHeight,
      );

      setFinalProcessedImage(canvas.toDataURL());
      handleCloseModal();
    };

    imageObj.src = selectedImage;
  };

  const handleUploadImage = () => {
    Utils.HandleUploadFile('image/*', (content) => {
      const theImage = new Image();
      theImage.src = content;

      theImage.onload = () => {
        setImageDimensions({
          width: theImage.naturalWidth,
          height: theImage.naturalHeight,
        });

        setSelectedImage(content);
      };
    });
  };

  const handleNoCrop = () => {
    if (!useCrop) setZoom(1);
    setUseCrop(!useCrop);
  };

  const cropperAspectRatio =
    useCrop && imageDimensions !== null
      ? imageDimensions.width / imageDimensions.height
      : 4 / 3;

  return (
    <div>
      {/* HANDLE PREVIEW IMAGE SELECTION AND CROP */}
      <Modal show={modalImageSelection} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{Translator('REPORT_MODAL_PREVIEW_TITLE')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <div style={{width: '100%', height: 400, position: 'relative'}}>
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={cropperAspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          )}

          <Row className="mt-4">
            <Col xs={6}>
              <div>Zoom</div>
              <RangeSlider
                tooltip="off"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                size="lg"
                onChange={(e) => setZoom(e.target.value)}
                style={{width: '100%'}}
                disabled={selectedImage === null}
              />
            </Col>
            <Col xs={6}>
              <Row>
                <Form>
                  <div>{Translator('REPORT_MODAL_PREVIEW_CROP')}</div>
                  <div key="nocrop" className="mb-3">
                    <Form.Check
                      id="nocrop"
                      type="checkbox"
                      label={Translator('REPORT_MODAL_PREVIEW_CROP_LABEL')}
                      checked={useCrop}
                      onClick={handleNoCrop}
                    />
                  </div>
                </Form>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div>{Translator('REPORT_MODAL_PREVIEW_SCALE')}</div>
              <RangeSlider
                tooltip="off"
                value={scale}
                min={10}
                max={100}
                step={0.1}
                size="lg"
                onChange={(e) => setScale(e.target.value)}
                style={{width: '100%'}}
                disabled={selectedImage === null}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {Translator('CLOSE')}
          </Button>
          <Button variant="secondary" onClick={handleUploadImage}>
            {Translator('REPORT_MODAL_PREVIEW_CHOOSE_IMAGE')}
          </Button>
          <Button variant="primary" onClick={handleApplyCrop}>
            {Translator('CONFIRM')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CONTROL BUTTONS SECTION */}
      <Row>
        <Col>
          <ReportMenu />
        </Col>
      </Row>

      <div id="report" style={{padding: '0px 10px', fontSize: '16pt'}}>
        <div style={{backgroundColor: '#fff', minHeight: '1300px'}}>
          {/* HEADER */}
          <Row className="mt-5">
            {/* LEFT SIDE */}
            <Col xs="6">
              <ReportHeader
                subtitle={Translator('PROCESSING_REPORT_TITLE')}
                date={moment().format('LLL')}
              />
            </Col>

            {/* RIGHT SIDE */}
            <Col xs="6">
              {/* SERVICE ORDER NUMBER */}
              {/* EDITABLE */}
              <InputGroup className="mb-2 noprint">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    {Translator('SERVICE_ORDER')}
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={serviceOrder}
                  onChange={({target}) => setServiceOrder(target.value)}
                />
              </InputGroup>

              {/* PRINTABLE */}
              <PenField
                printOnly
                label={`${Translator('SERVICE_ORDER')}:`}
                value={serviceOrder}
              />

              {/* CLIENT */}
              {/* EDITABLE */}
              <InputGroup className="mb-2 noprint">
                <InputGroup.Prepend>
                  <InputGroup.Text>{Translator('CLIENT')}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={clientName}
                  onChange={({target}) => setClientName(target.value)}
                />
              </InputGroup>

              {/* PRINTABLE */}
              <PenField
                printOnly
                label={`${Translator('CLIENT')}:`}
                value={clientName}
              />

              {/* RESPONSIBLE */}
              {/* EDITABLE */}
              <InputGroup className="mb-2 noprint">
                <InputGroup.Prepend>
                  <InputGroup.Text>{Translator('REPONSIBLE')}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={responsableName}
                  onChange={({target}) => setResponsableName(target.value)}
                />
              </InputGroup>

              {/* PRINTABLE */}
              <PenField
                printOnly
                label={`${Translator('REPONSIBLE')}:`}
                value={responsableName}
              />

              {/* Order Date */}
              {/* EDITABLE */}
              <div className="noprint">
                <DateTimePickerCustom
                  closeOnSelect
                  locale={Translator('MOMENTJS')}
                  label={Translator('REQUEST_DATE')}
                  value={orderDate}
                  onChange={(value) => setOrderDate(value)}
                  timeFormat={false}
                />
              </div>

              {/* PRINTABLE */}
              <PenField
                printOnly
                label={Translator('REQUEST_DATE')}
                value={
                  deliveryDate !== null
                    ? moment(orderDate)
                        .locale(Translator('MOMENTJS'))
                        .format('LL')
                    : ''
                }
              />

              {/* Order Date */}
              {/* EDITABLE */}
              <div className="noprint">
                <DateTimePickerCustom
                  closeOnSelect
                  locale={Translator('MOMENTJS')}
                  label={Translator('DELIVERY_DATE')}
                  value={deliveryDate}
                  onChange={(value) => setDeliveryDate(value)}
                  timeFormat={false}
                />
              </div>

              {/* PRINTABLE */}
              <PenField
                printOnly
                label={Translator('DELIVERY_DATE')}
                value={
                  deliveryDate !== null
                    ? moment(deliveryDate)
                        .locale(Translator('MOMENTJS'))
                        .format('LL')
                    : ''
                }
              />
            </Col>
          </Row>

          {/* TABLES [MALE and FEMALE] */}
          <Row className="mt-5">
            <Col xs="6">
              <h5>{Translator('MALE').toUpperCase()}</h5>
              <TableContentCentered>
                <thead>
                  <tr>
                    <th>-</th>
                    {Object.keys(clothingIcons)
                      .filter((key) => {
                        // Always return no variant clothes
                        if (clothingIcons[key].isCycling === undefined) {
                          return true;
                        }

                        // Only return bike or normal clothes, never both;
                        if (clothingIcons[key].isCycling !== isCycling) {
                          return false;
                        }

                        return true;
                      })
                      .map((clothingIcon) => {
                        const genericName = clothingIcon.replace('Cycling', '');
                        const empty = isEmptyClothingSettings(
                          sortedOrderList.male[genericName],
                        );

                        if (empty) return false;

                        return (
                          <th
                            key={clothingIcon}
                            className={
                              isEmptyClothingSettings(
                                sortedOrderList.male[clothingIcon],
                              )
                                ? 'd-none'
                                : ''
                            }>
                            <img
                              src={clothingIcons[clothingIcon].icon}
                              alt="clothing"
                              height={25}
                            />
                          </th>
                        );
                      })}
                  </tr>
                </thead>
                <tbody>
                  {[...clothingSizes]
                    .filter((item) => item.gender === 'MALE')
                    .map((size) => (
                      <tr
                        key={size.id}
                        className={
                          isEmptyClothingWithSize(
                            sortedOrderList.male,
                            size.value,
                          )
                            ? 'd-none'
                            : ''
                        }>
                        {/* RENDER VALUE */}
                        <td>{Translator(size.value)}</td>

                        {/* RENDER COLUMNS */}
                        {Object.keys(clothingIcons)
                          .filter((key) => {
                            // Always return no variant clothes
                            if (clothingIcons[key].isCycling === undefined) {
                              return true;
                            }

                            // Only return bike or normal clothes, never both;
                            if (clothingIcons[key].isCycling !== isCycling) {
                              return false;
                            }

                            return true;
                          })
                          .map((clothingIcon) => {
                            const genericName = clothingIcon.replace(
                              'Cycling',
                              '',
                            );
                            const settings = sortedOrderList.male[genericName];
                            const quantityForTheSize = settings[size.value];

                            return (
                              <td
                                key={clothingIcon}
                                className={
                                  isEmptyClothingSettings(settings)
                                    ? 'd-none'
                                    : ''
                                }>
                                {quantityForTheSize > 0
                                  ? quantityForTheSize
                                  : ''}
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                </tbody>
              </TableContentCentered>
            </Col>

            <Col xs="6">
              <h5>{Translator('FEMALE').toUpperCase()}</h5>
              <TableContentCentered>
                <thead>
                  <tr>
                    <th>-</th>
                    {Object.keys(clothingIcons)
                      .filter((key) => {
                        // Always return no variant clothes
                        if (clothingIcons[key].isCycling === undefined) {
                          return true;
                        }

                        // Only return bike or normal clothes, never both;
                        if (clothingIcons[key].isCycling !== isCycling) {
                          return false;
                        }

                        return true;
                      })
                      .map((clothingIcon) => {
                        const genericName = clothingIcon.replace('Cycling', '');
                        const empty = isEmptyClothingSettings(
                          sortedOrderList.female[genericName],
                        );

                        if (empty) return false;

                        return (
                          <th
                            key={clothingIcon}
                            className={
                              isEmptyClothingSettings(
                                sortedOrderList.female[clothingIcon],
                              )
                                ? 'd-none'
                                : ''
                            }>
                            <img
                              src={clothingIcons[clothingIcon].icon}
                              alt="clothing"
                              height={25}
                            />
                          </th>
                        );
                      })}
                  </tr>
                </thead>
                <tbody>
                  {[...clothingSizes]
                    .filter((item) => item.gender === 'FEMALE')
                    .map((size) => (
                      <tr
                        key={size.id}
                        className={
                          isEmptyClothingWithSize(
                            sortedOrderList.female,
                            size.value,
                          )
                            ? 'd-none'
                            : ''
                        }>
                        <td>{Translator(size.value)}</td>
                        {Object.keys(clothingIcons)
                          .filter((key) => {
                            // Always return no variant clothes
                            if (clothingIcons[key].isCycling === undefined) {
                              return true;
                            }

                            // Only return bike or normal clothes, never both;
                            if (clothingIcons[key].isCycling !== isCycling) {
                              return false;
                            }

                            return true;
                          })
                          .map((clothingIcon) => {
                            const genericName = clothingIcon.replace(
                              'Cycling',
                              '',
                            );
                            const settings =
                              sortedOrderList.female[genericName];
                            const quantityForTheSize = settings[size.value];

                            return (
                              <td
                                key={clothingIcon}
                                className={
                                  isEmptyClothingSettings(settings)
                                    ? 'd-none'
                                    : ''
                                }>
                                {quantityForTheSize > 0
                                  ? quantityForTheSize
                                  : ''}
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                </tbody>
              </TableContentCentered>
            </Col>
          </Row>

          {/* TABLES [CHILDISH and NOTES] */}
          <Row className="mt-4">
            <Col xs="6">
              <h5>{Translator('CHILDISH').toUpperCase()}</h5>
              <TableContentCentered>
                <thead>
                  <tr>
                    <th>-</th>
                    {Object.keys(clothingIcons)
                      .filter((key) => {
                        // Always return no variant clothes
                        if (clothingIcons[key].isCycling === undefined) {
                          return true;
                        }

                        // Only return bike or normal clothes, never both;
                        if (clothingIcons[key].isCycling !== isCycling) {
                          return false;
                        }

                        return true;
                      })
                      .map((clothingIcon) => {
                        const genericName = clothingIcon.replace('Cycling', '');
                        const empty = isEmptyClothingSettings(
                          sortedOrderList.childish[genericName],
                        );

                        if (empty) return false;

                        return (
                          <th
                            key={clothingIcon}
                            className={
                              isEmptyClothingSettings(
                                sortedOrderList.childish[clothingIcon],
                              )
                                ? 'd-none'
                                : ''
                            }>
                            <img
                              src={clothingIcons[clothingIcon].icon}
                              alt="clothing"
                              height={25}
                            />
                          </th>
                        );
                      })}
                  </tr>
                </thead>
                <tbody>
                  {[...clothingSizes].map((size) => (
                    <tr
                      key={size.id}
                      className={
                        isEmptyClothingWithSize(
                          sortedOrderList.childish,
                          size.value,
                        )
                          ? 'd-none'
                          : ''
                      }>
                      <td>{Translator(size.value)}</td>
                      {Object.keys(clothingIcons)
                        .filter((key) => {
                          // Always return no variant clothes
                          if (clothingIcons[key].isCycling === undefined) {
                            return true;
                          }

                          // Only return bike or normal clothes, never both;
                          if (clothingIcons[key].isCycling !== isCycling) {
                            return false;
                          }

                          return true;
                        })
                        .map((clothingIcon) => {
                          const genericName = clothingIcon.replace(
                            'Cycling',
                            '',
                          );
                          const settings =
                            sortedOrderList.childish[genericName];
                          const quantityForTheSize = settings[size.value];

                          return (
                            <td
                              key={clothingIcon}
                              className={
                                isEmptyClothingSettings(settings)
                                  ? 'd-none'
                                  : ''
                              }>
                              {quantityForTheSize > 0 ? quantityForTheSize : ''}
                            </td>
                          );
                        })}
                    </tr>
                  ))}
                </tbody>
              </TableContentCentered>
            </Col>

            <Col xs="6">
              <h5>{Translator('ANNOTATIONS').toUpperCase()}</h5>
              <Form.Control
                value={orderListItemsNotes}
                onChange={({target}) => setOrderListItemsNotes(target.value)}
                as="textarea"
                maxLength={560}
                style={{
                  color: '#000',
                  fontSize: '18px',
                  height: '395px',
                  resize: 'none',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '25px 20px',
                }}
              />
            </Col>
          </Row>
        </div>

        {/* BOTTOM PIECES COUNT */}
        {consolidatedCounting !== null && (
          <Row>
            <Col xs="4">
              <h5>{Translator('REPORT_PIECES_COUNTING')}</h5>
              <TableContentCentered>
                <tbody>
                  <tr>
                    {Object.keys(clothingIcons)
                      .filter((key) => {
                        // Always return no variant clothes
                        if (clothingIcons[key].isCycling === undefined) {
                          return true;
                        }

                        // Only return bike or normal clothes, never both;
                        if (clothingIcons[key].isCycling !== isCycling) {
                          return false;
                        }

                        return true;
                      })
                      .map((item) => (
                        <React.Fragment key={item}>
                          <td>
                            <img src={clothingIcons[item].icon} alt="Icon" />
                          </td>
                          <td>{consolidatedCounting[item]}</td>
                        </React.Fragment>
                      ))}

                    <td style={{backgroundColor: '#ddd'}}>
                      <strong>Total</strong>
                    </td>
                    <td>
                      {Object.values(consolidatedCounting).reduce(
                        (a, b) => a + b,
                      )}
                    </td>
                  </tr>
                </tbody>
              </TableContentCentered>
            </Col>
          </Row>
        )}

        {finalProcessedImage && (
          <Row className="mt-4">
            <Col xs="12">
              <h5>{Translator('REPORT_LAYOUT_IMAGE')}</h5>
              <img
                alt={Translator('REPORT_LAYOUT_IMAGE')}
                src={finalProcessedImage}
                width={`${scale}%`}
              />
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default Report;
