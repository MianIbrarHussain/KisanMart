import React, {Component, useEffect, useState} from 'react';
import * as BlinkIDReactNative from 'blinkid-react-native';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
} from 'react-native';
import InputField from '../../components/InputField';
import {Colors} from '../../theme/theme';

const licenseKey = Platform.select({
  // iOS license key for applicationID: com.microblink.sample
  ios: 'sRwCABVjb20ubWljcm9ibGluay5zYW1wbGUBbGV5SkRjbVZoZEdWa1QyNGlPakUzTURnd09EUTFNamM1TnpJc0lrTnlaV0YwWldSR2IzSWlPaUkwT1RabFpEQXpaUzAwT0RBeExUUXpZV1F0WVRrMU5DMDBNemMyWlRObU9UTTVNR1FpZlE9PTYmqMAMVMiFzaNDv15W9/CxDFVRDWRjok+uP0GtswDV4XTVGmhbivKDEb9Gtk2iMzf29qFWF8aUjIES4QSQFJG0xfBXZhluSk7lt4A959aHAZ0+BWgDnqZUPJAF2jZd0Pl2Kt1oDxLtqtf8V/RR+dPYzUV0PEA=',
  // android license key for applicationID: com.microblink.sample
  android:
    'sRwCAA1jb20ua2lzYW5tYXJ0AGxleUpEY21WaGRHVmtUMjRpT2pFM01UUTVNVGM0TWpFNU1UY3NJa055WldGMFpXUkdiM0lpT2lJME5XRmhNRFV4TVMweU9HTXlMVFE1TURNdE9UTXhZeTAyTkRnd1lqQmpPREUxWW1RaWZRPT3Ojt23zpBzvVR8YG6OUUhvS3sAwOZNYTYbpFcsrpI+tXmes7Lz9poSHJ7M+gHP0dN/6XrY80k5CPTJnE/lsvjCO5sNEkUXdPkDzGDrFN9Joj7L0H9QxWxCh34lg1tzUZoj2KwRTYiO0MXY7DJ7QshOr10U13az',
});

var renderIf = function (condition, content) {
  if (condition) {
    return content;
  }
  return null;
};

function buildResult(result, key) {
  if (result && result != -1) {
    return key + ': ' + result + '\n';
  }
  return '';
}

function buildDateResult(result, key) {
  if (result && result.day && result.month && result.year) {
    return (
      key +
      ': ' +
      result.day +
      '.' +
      result.month +
      '.' +
      result.year +
      '.' +
      '\n'
    );
  }
  return '';
}

const Sample = () => {
  const [showFrontImageDocument, setShowFrontImageDocument] = useState(false);
  const [resultFrontImageDocument, setResultFrontImageDocument] = useState('');
  const [showBackImageDocument, setShowBackImageDocument] = useState(false);
  const [resultBackImageDocument, setResultBackImageDocument] = useState('');
  const [showImageFace, setShowImageFace] = useState(false);
  const [resultImageFace, setResultImageFace] = useState('');
  const [showSuccessFrame, setShowSuccessFrame] = useState(false);
  const [successFrame, setSuccessFrame] = useState('');
  const [results, setResults] = useState('');
  const [result, setResult] = useState('');

  const scan = async () => {
    try {
      // to scan any machine readable travel document (passports, visas and IDs with
      // machine readable zone), use MrtdRecognizer
      // var mrtdRecognizer = new BlinkIDReactNative.MrtdRecognizer();
      // mrtdRecognizer.returnFullDocumentImage = true;

      // var mrtdSuccessFrameGrabber = new BlinkIDReactNative.SuccessFrameGrabberRecognizer(mrtdRecognizer);

      // BlinkIDMultiSideRecognizer automatically classifies different document types and scans the data from
      // the supported document
      var blinkIdMultiSideRecognizer =
        new BlinkIDReactNative.BlinkIdMultiSideRecognizer();
      blinkIdMultiSideRecognizer.returnFullDocumentImage = true;
      blinkIdMultiSideRecognizer.returnFaceImage = true;

      const scanningResults = await BlinkIDReactNative.BlinkID.scanWithCamera(
        new BlinkIDReactNative.BlinkIdOverlaySettings(),
        new BlinkIDReactNative.RecognizerCollection([
          blinkIdMultiSideRecognizer /*, mrtdSuccessFrameGrabber*/,
        ]),
        licenseKey,
      );

      if (scanningResults) {
        setShowFrontImageDocument(false);
        setResultFrontImageDocument('');
        setShowBackImageDocument(false);
        setResultBackImageDocument('');
        setShowImageFace(false);
        setResultImageFace('');
        setResults('');
        setShowImageFace(false);
        setSuccessFrame('');
        // let newState = {
        //   showFrontImageDocument: false,
        //   resultFrontImageDocument: '',
        //   showBackImageDocument: false,
        //   resultBackImageDocument: '',
        //   showImageFace: false,
        //   resultImageFace: '',
        //   results: '',
        //   showSuccessFrame: false,
        //   successFrame: '',
        // };

        for (let i = 0; i < scanningResults.length; ++i) {
          let localState = handleResult(scanningResults[i]);
          setShowFrontImageDocument(
            showFrontImageDocument || localState.showFrontImageDocument,
          );
          if (localState.showFrontImageDocument) {
            setResultFrontImageDocument(localState.resultFrontImageDocument);
          }
          setShowBackImageDocument(
            showBackImageDocument || localState.showBackImageDocument,
          );
          if (localState.showBackImageDocument) {
            setResultBackImageDocument(localState.resultBackImageDocument);
          }
          setShowImageFace(showImageFace || localState.showImageFace);
          if (localState.resultImageFace) {
            setResultImageFace(localState.resultImageFace);
          }
          setResults(results + localState.results);
          setShowSuccessFrame(showSuccessFrame || localState.showSuccessFrame);
          if (localState.successFrame) {
            setSuccessFrame(localState.successFrame);
          }
        }
        setResults(results + '\n');
      }
    } catch (error) {
      console.log(error);

      setShowFrontImageDocument(false);
      setResultFrontImageDocument('');
      setShowBackImageDocument(false);
      setResultBackImageDocument('');
      setShowImageFace(false);
      setResultImageFace('');
      setResults('Scanning has been cancelled');
      setShowImageFace(false);
      setSuccessFrame('');
    }
  };
  console.log('result');
  console.log(result);
  function handleResult(result) {
    var localState = {
      showFrontImageDocument: false,
      resultFrontImageDocument: '',
      showBackImageDocument: false,
      resultBackImageDocument: '',
      resultImageFace: '',
      results: '',
      showSuccessFrame: false,
      successFrame: '',
    };

    if (result instanceof BlinkIDReactNative.BlinkIdMultiSideRecognizerResult) {
      let blinkIdResult = result;
      console.log('blinkIdResult');
      console.log(blinkIdResult);
      const infoArr = {
        firstName: blinkIdResult.firstName.description,
        lastName: blinkIdResult.lastName.description,
        fullName: blinkIdResult.fullName.description,
        localizedName: blinkIdResult.localizedName.description,
        fatherName: blinkIdResult.additionalNameInformation.description,
        address: blinkIdResult.address.description,
        additionalAddressInfo:
          blinkIdResult.additionalAddressInformation.description,
        documentNumber: blinkIdResult.documentNumber.description,
        additionalDocumentNumber:
          blinkIdResult.documentAdditionalNumber.description,
        sex: blinkIdResult.sex.description,
        issuingAuthority: blinkIdResult.issuingAuthority.description,
        nationality: blinkIdResult.nationality.description,
        dateOfBirth:
          blinkIdResult.dateOfBirth.originalDateStringResult.description,
        age: blinkIdResult.age,
        dateOfIssue:
          blinkIdResult.dateOfIssue.originalDateStringResult.description,
        dateOfExpiry:
          blinkIdResult.dateOfExpiry.originalDateStringResult.description,
        dateOfExpiryPermanent: blinkIdResult.dateOfExpiryPermanent,
        expired: blinkIdResult.expired,
        martialStatus: blinkIdResult.maritalStatus.description,
        personalIdNumber: blinkIdResult.personalIdNumber.description,
        profession: blinkIdResult.profession.description,
        race: blinkIdResult.race.description,
        religion: blinkIdResult.religion.description,
        residentialStatus: blinkIdResult.residentialStatus.description,
        processingStatus: blinkIdResult.processingStatus.description,
        recognitionMode: blinkIdResult.recognitionMode.description,

        // let dataMatchResult = blinkIdResult.dataMatch;
        // resultString +=

        //     dataMatchResult.stateForWholeDocument,
        //     'State for the whole document',
        //   ) +
        //     dataMatchResult.states[0].state, 'dateOfBirth') +
        //  dataMatchResult.states[1].state, 'dateOfExpiry') +
        // dataMatchResult.states[2].state, 'documentNumber');
      };
      console.log('infoArr');
      console.log(infoArr);
      setResult(infoArr);

      let resultString =
        buildResult(blinkIdResult.firstName.description, 'First name') +
        buildResult(blinkIdResult.lastName.description, 'Last name') +
        buildResult(blinkIdResult.fullName.description, 'Full name') +
        buildResult(blinkIdResult.localizedName.description, 'Localized name') +
        buildResult(
          blinkIdResult.additionalNameInformation.description,
          'Father Name',
        ) +
        buildResult(blinkIdResult.address.description, 'Address') +
        buildResult(
          blinkIdResult.additionalAddressInformation.description,
          'Additional address info',
        ) +
        buildResult(
          blinkIdResult.documentNumber.description,
          'Document number',
        ) +
        buildResult(
          blinkIdResult.documentAdditionalNumber.description,
          'Additional document number',
        ) +
        buildResult(blinkIdResult.sex.description, 'Sex') +
        buildResult(
          blinkIdResult.issuingAuthority.description,
          'Issuing authority',
        ) +
        buildResult(blinkIdResult.nationality.description, 'Nationality') +
        buildDateResult(blinkIdResult.dateOfBirth, 'Date of birth') +
        buildResult(blinkIdResult.age, 'Age') +
        buildDateResult(blinkIdResult.dateOfIssue, 'Date of issue') +
        buildDateResult(blinkIdResult.dateOfExpiry, 'Date of expiry') +
        buildResult(
          blinkIdResult.dateOfExpiryPermanent,
          'Date of expiry permanent',
        ) +
        buildResult(blinkIdResult.expired, 'Expired') +
        buildResult(blinkIdResult.maritalStatus.description, 'Martial status') +
        buildResult(
          blinkIdResult.personalIdNumber.description,
          'Personal id number',
        ) +
        buildResult(blinkIdResult.profession.description, 'Profession') +
        buildResult(blinkIdResult.race.description, 'Race') +
        buildResult(blinkIdResult.religion.description, 'Religion') +
        buildResult(
          blinkIdResult.residentialStatus.description,
          'Residential status',
        ) +
        buildResult(
          blinkIdResult.processingStatus.description,
          'Processing status',
        ) +
        buildResult(
          blinkIdResult.recognitionMode.description,
          'Recognition mode',
        );
      let dataMatchResult = blinkIdResult.dataMatch;
      resultString +=
        buildResult(
          dataMatchResult.stateForWholeDocument,
          'State for the whole document',
        ) +
        buildResult(dataMatchResult.states[0].state, 'dateOfBirth') +
        buildResult(dataMatchResult.states[1].state, 'dateOfExpiry') +
        buildResult(dataMatchResult.states[2].state, 'documentNumber');

      let licenceInfo = blinkIdResult.driverLicenseDetailedInfo;
      if (licenceInfo) {
        var vehicleClassesInfoString = '';
        if (licenceInfo.vehicleClassesInfo) {
          for (let i = 0; i < licenceInfo.vehicleClassesInfo.length; i++) {
            vehicleClassesInfoString +=
              buildResult(
                licenceInfo.vehicleClassesInfo[i].vehicleClass.description,
                'Vehicle class',
              ) +
              buildResult(
                licenceInfo.vehicleClassesInfo[i].licenceType.description,
                'License type',
              ) +
              buildDateResult(
                licenceInfo.vehicleClassesInfo[i].effectiveDate,
                'Effective date',
              ) +
              buildDateResult(
                licenceInfo.vehicleClassesInfo[i].expiryDate,
                'Expiry date',
              );
          }
        }
        resultString +=
          buildResult(licenceInfo.restrictions.description, 'Restrictions') +
          buildResult(licenceInfo.endorsements.description, 'Endorsements') +
          buildResult(licenceInfo.vehicleClass.description, 'Vehicle class') +
          buildResult(licenceInfo.conditions.description, 'Conditions') +
          vehicleClassesInfoString;
      }

      // there are other fields to extract
      localState.results += resultString;

      // Document image is returned as Base64 encoded JPEG
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
      // Face image is returned as Base64 encoded JPEG
      if (blinkIdResult.faceImage) {
        localState.showImageFace = true;
        localState.resultImageFace =
          'data:image/jpg;base64,' + blinkIdResult.faceImage;
      }
    }
    return localState;
  }
  useEffect(() => {
    scan();
  }, []);

  const Fields = ({title, value}) => {
    return (
      <View style={{width: '90%', alignSelf: 'center', marginTop: 10}}>
        <Text style={{fontWeight: 'bold', color: 'black'}}>{title}</Text>
        <InputField
          placeholder={result.fullName}
          style={{marginVertical: 10, borderRadius: 10}}
          width="100%"
          value={value}
        />
      </View>
    );
  };
  // let displayFrontImageDocument = this.state.resultFrontImageDocument;
  // let displayBackImageDocument = this.state.resultFrontImageDocument;
  // let displayImageFace = this.state.resultImageFace;
  // let displaySuccessFrame = this.state.successFrame;
  // let displayFields = this.state.results;
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button onPress={scan} title="Scan again" color={Colors.primary} />
      </View>
      <ScrollView
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={200}>
        {renderIf(
          showImageFace,
          <View
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              alignSelf: 'center',
              marginVertical: 15,
            }}>
            <Image
              resizeMode="contain"
              source={{uri: resultImageFace, scale: 3}}
              style={{width: '100%', height: '100%', borderRadius: 100}}
            />
          </View>,
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '90%',
            alignSelf: 'center',
            marginBottom: 15,
          }}>
          {renderIf(
            showFrontImageDocument,
            <View style={styles.imageContainer}>
              <Image
                resizeMode="contain"
                source={{uri: resultFrontImageDocument, scale: 3}}
                style={styles.imageResult}
              />
            </View>,
          )}
          {renderIf(
            showBackImageDocument,
            <View style={styles.imageContainer}>
              <Image
                resizeMode="contain"
                source={{uri: resultBackImageDocument, scale: 3}}
                style={styles.imageResult}
              />
            </View>,
          )}
        </View>
        {renderIf(
          result,
          <View>
            <Fields title="Full Name" value={result.fullName} />
            <Fields title="Father Name" value={result.fatherName} />
            <Fields title="CNIC" value={result.personalIdNumber} />
            <Fields title="Gender" value={result.sex} />
            <Fields title="Date of birth" value={result.dateOfBirth} />
            <Fields title="Age" value={result.age?.toString()} />
            <Fields title="Date Of Issue" value={result.dateOfIssue} />
            <Fields title="Date Of Expiry" value={result.dateOfExpiry} />
            <Fields title="Valid" value={result.expired ? 'Yes' : 'No'} />
          </View>,
        )}

        {renderIf(
          showSuccessFrame,
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              source={{uri: successFrame, scale: 3}}
              style={styles.imageResult}
            />
          </View>,
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  label: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 50,
  },
  buttonContainer: {
    margin: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 0.5,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 10,
    width: '48%',
    height: 125,
    alignItems: 'center',
    borderColor: 'grey',
  },
  results: {
    fontSize: 16,
    textAlign: 'left',
    margin: 10,
  },
  imageResult: {
    height: '95%',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
});
export default Sample;
