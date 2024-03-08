import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Uploading } from "../../components/Uploading";
import * as ImagePicker from "expo-image-picker";
import ToastNotification from '../../components/Toast';
import { Video } from "expo-av";
import { UploadingAndroid } from "../../components/UploadingAndroid";
import VideoUploadModal from './../../components/VideoUploadModal'
import { firebase } from '../../config'

const Videos = ({ route }) => {
  const navigation = useNavigation()
  const courseId = route.params.courseId;
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoTitle, setVideoTitle] = useState('')


  async function pickVideo() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      await uploadVideo(result.assets[0].uri);
    }
  }

  async function uploadVideo(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = firebase.storage().ref().child("Videos/" + new Date().getTime());
      const uploadTask = storageRef.put(blob);

      // Listen for events
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
          setProgress(progress.toFixed());
        },
        (error) => {
          // Handle error
          console.error("Error uploading video:", error);
        },
        async () => {
          // Upload completed successfully
          try {
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            // console.log("File available at", downloadURL);

            // Save record
            saveRecord(downloadURL, new Date().toISOString());
            setVideo("");
            setShowToast(true)
            setTimeout(() => {
              setShowToast(false);
            }, 5000);
          } catch (downloadError) {
            console.error("Error getting download URL:", downloadError);
          }
        }
      );
    } catch (fetchError) {
      console.error("Error fetching video:", fetchError);
    }
  }


  async function saveRecord(url, createdAt) {
    const user_id = firebase.auth().currentUser.uid
    await firebase.firestore().collection("Videos").add({
      course_id: courseId,
      teacher_id: user_id,
      video_title : videoTitle,
      video: url,
      uploadedAt: createdAt,
    })
      .then((docRef) => {
        return docRef.update({ video_id: docRef.id });
      })
      .then(() => {
        // console.log("Document updated with fileId");
      })
      .catch((error) => {
        console.error("Error saving document:", error);
      });
  }


  return (
    <View style={styles.mainContainer}>
      {isModalVisible ? <VideoUploadModal isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        videoTitle={videoTitle}
        setVideoTitle={setVideoTitle}
        pickVideo={pickVideo} /> : null}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={20} color="black" />
        <Text style={{ fontSize: 16 }}> Go Back</Text>
      </TouchableOpacity>
      <View style={styles.heading}>
        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
          <Octicons name="video" size={30} color="black" />
          <Text style={{ fontSize: 25 }}> Videos</Text>
        </View>
        <TouchableOpacity onPress={()=> {setIsModalVisible(true)}}>
          <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', marginTop: 5 }}>
            <Feather name="upload" size={24} color="black" />
            <Text style={{ fontSize: 16, marginVertical: 2 }}>UPLOAD</Text>
          </View>
        </TouchableOpacity>
      </View>
      {video &&
        (Platform.OS === "ios" ? (
          <Uploading video={video} progress={progress} />
        ) : (
          // Some features of blur are not available on Android
          <UploadingAndroid video={video} progress={progress} />
        ))}
      {showToast ? <ToastNotification
        icon={<AntDesign name="checkcircle" size={27} color="white" />}
        message='Video Uploaded Successfully'
        color="green"
        bottom={30} /> : null}
    </View>
  )
}

export default Videos

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 120,
    flexDirection: 'column'
  },
  backButton: {
    marginLeft: 15,
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    width: '90%',
    justifyContent: 'flex-start'
  },
  heading: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    width: '90%'
  },
  content: {
    marginTop: 10,
    width: '100%',
    alignSelf: 'center',
    // flex: 1

  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '90%',
    marginTop: 10
  },
})