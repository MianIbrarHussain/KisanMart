import React from 'react';
import * as BlinkIDReactNative from 'blinkid-react-native';
import {Platform, Button} from 'react-native';

import {Colors} from '../../theme/theme';

const licenseKey = Platform.select({
  // iOS license key for applicationID: com.microblink.sample
  ios: 'sRwCABVjb20ubWljcm9ibGluay5zYW1wbGUBbGV5SkRjbVZoZEdWa1QyNGlPakUzTURnd09EUTFNamM1TnpJc0lrTnlaV0YwWldSR2IzSWlPaUkwT1RabFpEQXpaUzAwT0RBeExUUXpZV1F0WVRrMU5DMDBNemMyWlRObU9UTTVNR1FpZlE9PTYmqMAMVMiFzaNDv15W9/CxDFVRDWRjok+uP0GtswDV4XTVGmhbivKDEb9Gtk2iMzf29qFWF8aUjIES4QSQFJG0xfBXZhluSk7lt4A959aHAZ0+BWgDnqZUPJAF2jZd0Pl2Kt1oDxLtqtf8V/RR+dPYzUV0PEA=',
  // android license key for applicationID: com.microblink.sample
  android:
    'sRwCAA1jb20ua2lzYW5tYXJ0AGxleUpEY21WaGRHVmtUMjRpT2pFM01UUTVNVGM0TWpFNU1UY3NJa055WldGMFpXUkdiM0lpT2lJME5XRmhNRFV4TVMweU9HTXlMVFE1TURNdE9UTXhZeTAyTkRnd1lqQmpPREUxWW1RaWZRPT3Ojt23zpBzvVR8YG6OUUhvS3sAwOZNYTYbpFcsrpI+tXmes7Lz9poSHJ7M+gHP0dN/6XrY80k5CPTJnE/lsvjCO5sNEkUXdPkDzGDrFN9Joj7L0H9QxWxCh34lg1tzUZoj2KwRTYiO0MXY7DJ7QshOr10U13az',
});

const Sample = ({data, setData}) => {
  const scan = async () => {
    try {
      const blinkIdMultiSideRecognizer =
        new BlinkIDReactNative.BlinkIdMultiSideRecognizer();
      blinkIdMultiSideRecognizer.returnFullDocumentImage = true;
      blinkIdMultiSideRecognizer.returnFaceImage = true;

      const scanningResults = await BlinkIDReactNative.BlinkID.scanWithCamera(
        new BlinkIDReactNative.BlinkIdOverlaySettings(),
        new BlinkIDReactNative.RecognizerCollection([
          blinkIdMultiSideRecognizer,
        ]),
        licenseKey,
      );

      if (scanningResults) {
        scanningResults.forEach(scanningResult => {
          const localState = handleResult(scanningResult);

          if (localState.showFrontImageDocument) {
            setData(prevData => ({
              ...prevData,
              resultFrontImageDocument: localState.resultFrontImageDocument,
            }));
          }

          if (localState.showBackImageDocument) {
            setData(prevData => ({
              ...prevData,
              resultBackImageDocument: localState.resultBackImageDocument,
            }));
          }

          if (localState.resultImageFace) {
            setData(prevData => ({
              ...prevData,
              resultImageFace: localState.resultImageFace,
            }));
          }

          setData(prevData => ({
            ...prevData,
            ...localState.infoArr,
          }));
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResult = result => {
    let localState = {
      showFrontImageDocument: false,
      resultFrontImageDocument: '',
      showBackImageDocument: false,
      resultBackImageDocument: '',
      resultImageFace: '',
      results: '',
      showSuccessFrame: false,
      successFrame: '',
      infoArr: {},
    };

    if (result instanceof BlinkIDReactNative.BlinkIdMultiSideRecognizerResult) {
      const blinkIdResult = result;

      const infoArr = {
        firstName: blinkIdResult.firstName?.description || '',
        lastName: blinkIdResult.lastName?.description || '',
        fullName: blinkIdResult.fullName?.description || '',
        localizedName: blinkIdResult.localizedName?.description || '',
        fatherName: blinkIdResult.additionalNameInformation?.description || '',
        address: blinkIdResult.address?.description || '',
        additionalAddressInfo:
          blinkIdResult.additionalAddressInformation?.description || '',
        documentNumber: blinkIdResult.documentNumber?.description || '',
        additionalDocumentNumber:
          blinkIdResult.documentAdditionalNumber?.description || '',
        sex: blinkIdResult.sex?.description || '',
        issuingAuthority: blinkIdResult.issuingAuthority?.description || '',
        nationality: blinkIdResult.nationality?.description || '',
        dateOfBirth:
          blinkIdResult.dateOfBirth?.originalDateStringResult?.description ||
          '',
        age: blinkIdResult.age || '',
        dateOfIssue:
          blinkIdResult.dateOfIssue?.originalDateStringResult?.description ||
          '',
        dateOfExpiry:
          blinkIdResult.dateOfExpiry?.originalDateStringResult?.description ||
          '',
        dateOfExpiryPermanent: blinkIdResult.dateOfExpiryPermanent || '',
        expired: blinkIdResult.expired || '',
        martialStatus: blinkIdResult.maritalStatus?.description || '',
        personalIdNumber: blinkIdResult.personalIdNumber?.description || '',
        profession: blinkIdResult.profession?.description || '',
        race: blinkIdResult.race?.description || '',
        religion: blinkIdResult.religion?.description || '',
        residentialStatus: blinkIdResult.residentialStatus?.description || '',
        processingStatus: blinkIdResult.processingStatus?.description || '',
        recognitionMode: blinkIdResult.recognitionMode?.description || '',
      };

      localState.infoArr = infoArr;

      let resultString = Object.entries(infoArr)
        .map(([key, value]) => buildResult(value, key))
        .join('');

      let licenceInfo = blinkIdResult.driverLicenseDetailedInfo;
      if (licenceInfo) {
        const vehicleClassesInfoString = licenceInfo.vehicleClassesInfo
          ? licenceInfo.vehicleClassesInfo
              .map(info =>
                [
                  buildResult(info.vehicleClass?.description, 'Vehicle class'),
                  buildResult(info.licenceType?.description, 'License type'),
                  buildDateResult(info.effectiveDate, 'Effective date'),
                  buildDateResult(info.expiryDate, 'Expiry date'),
                ].join(''),
              )
              .join('')
          : '';

        resultString += [
          buildResult(licenceInfo.restrictions?.description, 'Restrictions'),
          buildResult(licenceInfo.endorsements?.description, 'Endorsements'),
          buildResult(licenceInfo.vehicleClass?.description, 'Vehicle class'),
          buildResult(licenceInfo.conditions?.description, 'Conditions'),
          vehicleClassesInfoString,
        ].join('');
      }

      localState.results += resultString;

      if (blinkIdResult.fullDocumentFrontImage) {
        localState.showFrontImageDocument = true;
        localState.resultFrontImageDocument =
          'data:image/jpg;base64,' + blinkIdResult.fullDocumentFrontImage;
      }
      if (blinkIdResult.fullDocumentBackImage) {
        localState.showBackImageDocument = true;
        localState.resultBackImageDocument =
          'data:image/jpg;base64,' + blinkIdResult.fullDocumentBackImage;
      }
      if (blinkIdResult.faceImage) {
        localState.showImageFace = true;
        localState.resultImageFace =
          'data:image/jpg;base64,' + blinkIdResult.faceImage;
      }
    }
    return localState;
  };

  const buildResult = (result, key) => (result ? `${key}: ${result}\n` : '');
  const buildDateResult = (result, key) =>
    result?.day && result?.month && result?.year
      ? `${key}: ${result.day}.${result.month}.${result.year}.\n`
      : '';

  if (Object.keys(data).length === 0) {
    return (
      <Button onPress={scan} title="Scan Your CNIC" color={Colors.primary} />
    );
  } else {
    return null;
  }
};

export default Sample;
