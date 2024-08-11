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
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentModal, setCommentModal] = useState(false);
  const [userComment, setUserComment] = useState('');
  const [trackVideo, setTrackVideo] = useState('');

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  useEffect(() => {
    const fetchCurrentUserInfo = async () => {
      try {
        const doc = await firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .get();
  
        const userInfo = doc.data();
        setCurrentUserInfo(userInfo);
  
        // Fetch videos based on the user's enrolled courses
        if (userInfo && userInfo.enrolls && userInfo.enrolls.length > 0) {
          const unsubscribe = fetchVideos(userInfo.enrolls);
          return () => unsubscribe(); // Clean up the listener when the component unmounts
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
  
    fetchCurrentUserInfo();
  }, []);
  
  const fetchVideos = (enrolledCourseIds) => {
    try {
      const unsubscribe = firebase
        .firestore()
        .collection('Videos')
        .where('course_id', 'in', enrolledCourseIds)
        .onSnapshot(async (videoSnapshot) => {
          const videoData = videoSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          // Fetch course details for each video in real-time
          const videoWithCourseData = await Promise.all(
            videoData.map(async (video) => {
              const courseDoc = await firebase
                .firestore()
                .collection('courses')
                .doc(video.course_id)
                .get();
  
              return {
                ...video,
                course_title: courseDoc.data().title,
              };
            })
          );
  
          setVideos(videoWithCourseData);
        });
  
      return unsubscribe; // Return the unsubscribe function to clean up the listener
    } catch (error) {
      console.error('Error fetching videos or course data:', error);
    }
  };
  
  const handleLike = async (video) => {
    const userLiked = video.likes ? video.likes.includes(firebase.auth().currentUser.uid) : false;
    const videoRef = firebase.firestore().collection('Videos').doc(video.video_id);
    try {
      await videoRef.update({
        likeCount: !video.likeCount ? 1 : userLiked ? firebase.firestore.FieldValue.increment(-1) : firebase.firestore.FieldValue.increment(1),
        likes: userLiked ? firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid) : firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
      });
    } catch (error) {
      console.error('Error updating likes: ', error);
    }
  }

  const handleComment = (video) => {
    setCommentModal(true);
    setTrackVideo(video);
    try {
      const unsubscribe = firebase
        .firestore()
        .collection('Videos')
        .doc(video.video_id)
        .collection('comments')
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {
          const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setComments(comments);
        });
      return unsubscribe;
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const storeComments = async () => {
    if(userComment === '') {
      return;
    }
    try {
      // console.log(trackVideoId)
      // Add document to subcollection
      await firebase.firestore().collection('Videos').doc(trackVideo.video_id).collection('comments').add({
        comment: userComment,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userName: currentUserInfo.name,
        image: currentUserInfo.image,
      });
      setUserComment('')
      // Increment count field in the video document
      await firebase.firestore().collection('Videos').doc(trackVideo.video_id).update({
        commentCount: !trackVideo.commentCount ? 1 : firebase.firestore.FieldValue.increment(1)
      });
    } catch (error) {
      console.error('Error adding document to subcollection:', error);
    }
  };

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
      <View style={styles.likeCommentContainer}>
        <TouchableOpacity onPress={() => handleLike(item)} style={styles.likeBtn}>
          {(item.likes && item.likes.includes(firebase.auth().currentUser.uid)) ? <AntDesign name="like1" size={30} color="dodgerblue" /> : <AntDesign name="like2" size={30} color="black" />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleComment(item)} style={styles.commentBtn}>
          <FontAwesome5 name="comment" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {commentModal ? <CommentModal commentModal={commentModal}
        setCommentModal={setCommentModal}
        comments={comments}
        userComment={userComment}
        setUserComment={setUserComment}
        storeComments={storeComments}
        setComments={setComments} /> : null}
      <View style={styles.heading}>
        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
          <Octicons name="video" size={30} color="black" />
          <Text style={{ fontSize: 25 }}> Videos</Text>
        </View>
      </View>
      {videos.length == 0 ? <Text style={{ alignSelf: 'center', marginTop: 200, fontSize: 20 }}>No videos <Entypo name="emoji-sad" size={22} color="black" /></Text> : null}
      <View style={styles.FlatListContainer}>
        <FlatList
          data={videos.slice((page - 1) * 5, page * 5)} // Adjust based on pageSize
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {videos.length > 5 && <View style={styles.PaginationContainer}>
        <Pagination
          totalItems={videos.length}
          pageSize={5}
          currentPage={page}
          onPageChange={setPage}
          btnStyle={{ backgroundColor: 'black', borderRadius: 10 }}
          activeBtnStyle={{ backgroundColor: 'lightgray' }} />
      </View>}
    </View>
  )
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
    height: 550
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
  }
})