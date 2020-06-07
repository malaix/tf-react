import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native'
// Load mobilenet.
async function loadAndPredictImage(){


const model = await mobilenet.load();

// Get a reference to the bundled asset and convert it to a tensor
const image = require('./assets/cutecatpic.jpeg');
const imageAssetPath = Image.resolveAssetSource(image);
const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
const imageData = await response.arrayBuffer();

const imageTensor = decodeJpeg(imageData);

const prediction = await model.classify(imageTensor);
return prediction

// // Use prediction in app.
// setState({
//   prediction, // answer 
  
// });
}

export default function App() {
  const prediction = loadAndPredictImage() 
  
  return (
    <View style={styles.container}>
      <Text>This is Malaika's new app! (She is the best)</Text>
      <Text>{prediction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

