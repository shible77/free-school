import { StyleSheet, Text, View, TouchableOpacity, Platform, FlatList, Dimensions, useWindowDimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { ResizeMode } from "expo-av";
import VideoPlayer from 'expo-video-player'
import Pagination from '@cherry-soft/react-native-basic-pagination';
import { Entypo } from '@expo/vector-icons';
import { setStatusBarHidden } from 'expo-status-bar'
import * as ScreenOrientation from 'expo-screen-orientation'
import { firebase } from '../../../config'
import CommentModal from '../../../components/CommentModal';

const Videos = () => {
  
  const [page, setPage] = useState(1);
  const [inFullscreen2, setInFullscreen2] = useState(false)
  const [isMute, setIsMute] = useState(false)
  const refVideo2 = useRef(null)
  const [videos, setVideos] = useState([]);
  const [coursesInfo, setCoursesInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentModal, setCommentModal] = useState(false);
  const [userComment, setUserComment] = useState('');
  const [trackVideo, setTrackVideo] = useState('');
  const [loadedVideosCount, setLoadedVideosCount] = useState(5);
  const [currentUserInfo, setCurrentUserInfo] = useState(null)

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const fetchUserInfo = () => {
    const unsubscribe = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).onSnapshot((querySnapshot) => {
      setCurrentUserInfo(querySnapshot.data())
    })
    return () => unsubscribe()
  }

  useEffect(() => {
    const fetchVideosWithCourseTitles = () => {
      // Listener for real-time updates on the courses created by the teacher
      const unsubscribeCourses = firebase
        .firestore()
        .collection('courses')
        .where('teacher_id', '==', firebase.auth().currentUser.uid)
        .onSnapshot(async (courseSnapshot) => {
          const courses = courseSnapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            ...doc.data(),
          }));

          // Fetch videos for each course in real-time
          const videoPromises = courses.map((course) => {
            return new Promise((resolve, reject) => {
              const unsubscribeVideos = firebase
                .firestore()
                .collection('Videos')
                .where('course_id', '==', course.id)
                .onSnapshot(
                  (videoSnapshot) => {
                    const videos = videoSnapshot.docs.map((videoDoc) => ({
                      id: videoDoc.id,
                      ...videoDoc.data(),
                      course_title: course.title, // Attach the course title to each video
                    }));
                    resolve(videos);
                  },
                  (error) => {
                    reject(error);
                  }
                );
            });
          });

          // Resolve all video promises and update state
          try {
            const allVideos = await Promise.all(videoPromises);
            setVideos(shuffleArray(allVideos.flat())); // Flatten the array of arrays
          } catch (error) {
            console.error('Error fetching videos with course titles:', error);
          }
        });

      // Cleanup listeners on component unmount
      return () => unsubscribeCourses();
    };
    fetchUserInfo();
    fetchVideosWithCourseTitles();
  }, []);
  
  
  // console.log(videos)

  const renderVideoItem = ({ item }) => (

    <View style={styles.videoContainer}>
      <View style={styles.videoHeading}>
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.course_title}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => { alert('pressed') }}>
            <Entypo name="dots-three-vertical" size={20} color="black" />
          </TouchableOpacity>
        </View>

      </View>
      <VideoPlayer
        videoProps={{
          shouldPlay: false,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: item.video,
          },
          ref: refVideo2,
        }}

        icon={{
          pause: <AntDesign name="pausecircleo" size={35} color="white" />,
          play: <AntDesign name="playcircleo" size={35} color="white" />,
        }}

        mute={{
          enterMute: () => setIsMute(!isMute),
          exitMute: () => setIsMute(!isMute),
          isMute,
        }}

        fullscreen={{
          inFullscreen: inFullscreen2,
          enterFullscreen: async () => {
            setStatusBarHidden(true, 'fade')
            setInFullscreen2(!inFullscreen2)
            //  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
            refVideo2.current.setStatusAsync({
              shouldPlay: true,
            })
          },
          exitFullscreen: async () => {
            setStatusBarHidden(false, 'fade')
            setInFullscreen2(!inFullscreen2)
            // await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
          },
        }}
        style={{
          videoBackgroundColor: 'black',
          height: inFullscreen2 ? screenWidth : 260,
          width: inFullscreen2 ? screenHeight : 350,
        }}
      />
      <Text style={styles.videoTitle}>{item.video_title}</Text>
      <View style={styles.likeCmntCounter}>
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 16 }}>Likes : {!item.likeCount ? 0 : item.likeCount}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 16 }}>Comments : {!item.commentCount ? 0 : item.commentCount} </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.heading}>
        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
          <Octicons name="video" size={30} color="black" />
          <Text style={{ fontSize: 25 }}> Videos</Text>
        </View>
      </View>
      {videos.length === 0 ? <Text style={{ alignSelf: 'center', marginTop: 200, fontSize: 20 }}>No videos <Entypo name="emoji-sad" size={22} color="black" /></Text> : null}
      <View style={styles.FlatListContainer}>
        <FlatList
          data={videos.slice(0, loadedVideosCount)} // Show only the loaded videos
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
  
      {loadedVideosCount < videos.length && (
        <TouchableOpacity onPress={() => setLoadedVideosCount(loadedVideosCount + 5)} style={styles.loadMoreBtn}>
          <Text style={{ color: 'white' }}>Load More</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
}

export default Videos

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // marginTop: 120,
    flexDirection: 'column'
  },
  backButton: {
    marginLeft: 15,
    display: 'flex',
    flexDirection: 'row',
    marginTop: 130,
    width: '90%',
    justifyContent: 'flex-start'
  },
  heading: {
    marginTop: 130,
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
  videoContainer: {
    borderWidth: 2,
    padding: 5,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  videoHeading: {
    height: 25,
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
  }
  ,
  videoTitle: {
    fontSize: 17,
    marginTop: 10,
    fontWeight: 'bold'
  }
  ,
  FlatListContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 15,
    height: 610
  },
  likeCommentContainer: {
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    // borderTopWidth : 1,
    marginTop: 5
  },
  likeCmntCounter: {
    display: 'flex',
    marginTop: 10,
    width: '100%',
    height: 20,
    flexDirection: 'row',
  }
  ,
  likeBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    padding: 3,
    borderRadius: 5
  },
  commentBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  PaginationContainer: {
    position: 'fixed',
    alignSelf: 'center',
    bottom: 0,
    width: '100%'
  },
  loadMoreBtn: {
    alignSelf: 'center',
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    marginVertical: 15,
  }
})