import React, { useState } from 'react';
import { View, ActivityIndicator, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import * as tf from "@tensorflow/tfjs";
import * as FileSystem from "expo-file-system";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const modelJson = require("../assets/model/model.json");
const modelWeights = require("../assets/model/weights.bin");

const datasetClasses = ["Tomato", "Cucumber", "Carrot", "Bottle Gourd", "Bitter Gourd"];

const transformImageToTensor = async (uri) => {
  //read the image as base64
  const img64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const imgBuffer = tf.util.encodeString(img64, "base64").buffer;
  const raw = new Uint8Array(imgBuffer);
  let imgTensor = decodeJpeg(raw);
  const scalar = tf.scalar(255);
  //resize the image
  imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [224, 224]);
  //normalize; if a normalization layer is in the model, this step can be skipped
  const tensorScaled = imgTensor.div(scalar);
  //final shape of the tensor
  const img = tf.reshape(tensorScaled, [1, 224, 224, 3]);
  return img;
};

const App = ({ navigation }) => {

  const [prediction, setPrediction] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [loader, setLoader] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    // console.log(result)
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setLoader(true)
      await tf.ready();
      const model = await tf.loadLayersModel(
        bundleResourceIO(modelJson, modelWeights)
      );
      const imageTensor = await transformImageToTensor(result.assets[0].uri);
      const predictions = model.predict(imageTensor);
      // console.log(predictions);
      const highestPredictionIndex = predictions.argMax(1).dataSync();

      const predictedClass = `${datasetClasses[highestPredictionIndex]}`;
      setPrediction(predictedClass);
      setLoader(false)
    }
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setLoader(true)
      await tf.ready();
      const model = await tf.loadLayersModel(
        bundleResourceIO(modelJson, modelWeights)
      );
      const imageTensor = await transformImageToTensor(result.assets[0].uri);
      const predictions = model.predict(imageTensor);
      const highestPredictionIndex = predictions.argMax(1).dataSync();

      const predictedClass = `${datasetClasses[highestPredictionIndex]}`;
      setPrediction(predictedClass);
      setLoader(false)
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={20} color="black" />
        <Text style={{ fontSize: 16 }}> Go Back</Text>
      </TouchableOpacity>
      <View style={styles.details}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#3CB371', 'dodgerblue']} style={{
          borderRadius: 10,
          padding: 10
        }}>
          <Text style={styles.detailsText}>
            Import an image of a vegetable from the device or take an image of a vegetable using the device camera to detect which vegetable it is.</Text>
        </LinearGradient>
      </View>
      <View style={styles.buttonContainer}>
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#3CB371' }]} onPress={takePicture}>
            <Text style={styles.textStyle}>Take Image</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'dodgerblue' }]} onPress={pickImage}>
            <Text style={styles.textStyle}>Import Image</Text>
          </TouchableOpacity>
        </View>
      </View>
      {
          imageUri && <View style={{width : '90%', alignSelf : 'center', marginTop : 50}}>
            <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, alignSelf : 'center' }} />
            <View style={{display : 'flex', flexDirection : 'row', alignSelf : 'center', marginTop : 30}}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Your given image is a : </Text>
              {loader ? <ActivityIndicator size={'small'} color={'blue'}/> : <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}>{prediction}</Text>}
            </View>

          </View>
        }
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 50,
    width: '90%',
    flexDirection: 'row',
    display: 'flex',
    alignSelf: 'center'
  },
  button: {
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    height: 50,
    width: '80%'
  },
  textStyle: {
    fontSize: 19,
    color: 'white'
  },
  backButton: {
    marginLeft: 15,
    display: 'flex',
    flexDirection: 'row',
    marginTop: 50,
    width: '90%',
    justifyContent: 'flex-start'
  },
  details: {
    display: 'flex',
    alignSelf: 'center',
    width: '90%',
    marginTop: 15,
    borderWidth: 2,
    borderColor : 'black',
    borderRadius : 13
  },
  detailsText: {
    fontSize: 20,
    color: 'white'
  }
})