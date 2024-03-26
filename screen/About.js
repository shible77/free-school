import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import ColourfulText from '../components/ColorfulText'
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';

const About = ({ navigation }) => {
    return (
        <>
            <StatusBar translucent backgroundColor={"black"} />
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome5 name="arrow-left" size={20} color="black" />
                    <Text style={{ fontSize: 16 }}> Go Back</Text>
                </TouchableOpacity>
                <View style={styles.heading}>
                    <ColourfulText text={'Free-School'} color={['#3CB371', 'dodgerblue']} style={{ fontSize: 30, fontWeight: 'bold' }} />
                </View>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.details}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#3CB371', 'dodgerblue']} style={{
                            borderRadius: 10,
                            padding: 15
                        }}>
                            <Text style={styles.detailsText}>
                                {`Free-School is an online free teaching and learning platform. Here, you can sign up as a teacher if you have expertise in any subject and can teach someone with a better understanding, or you can sign up as a student and can enroll in courses without paying a fee.\n\nIn Free-School, teachers have the capability to create courses, upload videos, and organize quizzes. As a teacher, you can share your knowledge and expertise by designing comprehensive courses, providing instructional videos, and assessing student understanding through quizzes.\n\nOn the other hand, students can enroll in courses and gain access to a wide range of educational resources, including videos uploaded by teachers and interactive quizzes. By participating in courses, students can enhance their learning experience and acquire new skills at their own pace.`}
                            </Text>
                        </LinearGradient>

                    </View>
                    <View style={styles.videoContainer}>
                        <ColourfulText text={'Learn more about us in the following video'} color={['#3CB371', 'dodgerblue']} style={{ fontSize: 18, fontWeight: 'bold', alignSelf: 'center' }} />
                        <View style={styles.videoPlayer}>
                            <YoutubePlayer
                                height={200}
                                play={false}
                                videoId='Z20nUdAUGmM'
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

export default About

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    backButton: {
        marginLeft: 15,
        display: 'flex',
        flexDirection: 'row',
        marginTop: 50,
        width: '90%',
        justifyContent: 'flex-start'
    },
    heading: {
        marginTop: 10,
        alignSelf: 'center',
        width: '90%',
        height: 50,
        backgroundColor: 'lightgray',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    headingText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        marginTop: 10,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 20
    },
    details: {
        display: 'flex',
        alignSelf: 'center',
        width: '100%',
        marginTop: 5
    },
    detailsText: {
        fontSize: 18,
        color: 'lavender'
    },
    videoContainer: {
        marginTop: 15,
        width: "100%",
        height: 300
    },
    videoPlayer : {
        marginTop : 10,
        // alignSelf : 'center'
    }

})