import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { fetch, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as tf from "@tensorflow/tfjs";

async function loadAndPredictImage(image, model) {
  
  const imageAssetPath = Image.resolveAssetSource(image);
  // maybe cache these locally once they are loaded the first time? 
  const response = await fetch(imageAssetPath.uri, {}, { isBinary: true }); 

  // extract the image data and send it to the model for classification
  const imageData = await response.arrayBuffer();
  const imageTensor = decodeJpeg(new Uint8Array(imageData));
  const prediction = await model.classify(imageTensor);
  return prediction;
}

const images = [
  require("./assets/YDBK8742.jpeg"),
  require("./assets/IMG_3829.jpeg"),
  require("./assets/CZTR5150.jpeg"),
  require("./assets/cutecatpic.jpeg")
];

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  sampleImage: {
    width: '100%',
    height: 180,
  },
});

export default function App() {
  
  // set some local state setters and defaults...
  // the model
  const [model, setModel] = useState(null);
  
  // the selected image
  const [currentImageIndex, setCurrentImage] = useState(false);
  
  // the model output (prediction)
  const [prediction, setPrediction] = useState("");
  
  
  
  // load the model - do this once only
  useEffect(() => {
    tf.ready() // is TF ready? returns a javascript promise - which is 'thenable' 
      .then(mobilenet.load) 
      .then(m => setModel(m));
  }, []);


  // a new image has been selected - or a new model has been loaded
  // load the image and classify it
  useEffect(() => {
    if (!model) {
      return;
    }
    if(currentImageIndex === false){
      return;
    }
    setPrediction("")
    loadAndPredictImage(images[currentImageIndex], model)
      .then(p => setPrediction(p));
  }, [currentImageIndex, model]);


  // render the interface
  return (
    <View style={styles.container}>
      <Text>This is Malaika's new app! (She is the best)</Text>
      {!!prediction && currentImageIndex !== false && ( // only show if these conditions are true
        <View>
          <Image
            source={images[currentImageIndex]}
            style={styles.sampleImage}
          />
          {prediction.map((pr, index) => (
            <View key={`key-${index}`}>
              <Text>{pr.className}</Text>
              <Text>{pr.probability}</Text>
            </View>
          ))}
        </View>
      )}

      {
        // loop through the array of images using map, and render a button for each one
      images.map((img, index) => <Button key={img} onPress={() => setCurrentImage(index)} title={`Image ${img}`} />)
      }
      
    </View>
  );
}

