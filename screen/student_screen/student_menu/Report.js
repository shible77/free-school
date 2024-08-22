import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { firebase } from '../../../config'
import { FontAwesome5 } from '@expo/vector-icons';
import MyProgressChart from '../../../components/ProgressChart';

const Report = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)
            const userDoc = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get();
            const enrolls = userDoc.data().enrolls || [];

            if (enrolls.length > 0) {
                const allMarks = [];

                for (const course_id of enrolls) {
                    const quizzes = await firebase.firestore().collection('courses').doc(course_id).collection('quizzes').get();

                    quizzes.docs.forEach((doc) => {
                        if (doc.data().userID_along_mark) {
                            filteredData = doc.data().userID_along_mark.filter(item => item.uid === firebase.auth().currentUser.uid);

                            if (filteredData.length === 1) {
                                const mark = {
                                    quiz_title: doc.data().title,
                                    quiz_topic: doc.data().topic,
                                    mark: filteredData[0].mark,
                                };
                                allMarks.push(mark);
                            }
                        }
                    });
                }

                setData(allMarks); // Update state once after collecting all marks
                setSelect(allMarks[0]); // Set the first item as selected by default
                setLoading(false)
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSelect = (item) => {
        setSelect(item);
    };

    return (
        <>
            {loading === false ? <><View style={styles.mainContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome5 name="arrow-left" size={20} color="black" />
                    <Text style={{ fontSize: 16 }}> Go Back</Text>
                </TouchableOpacity>
                <ScrollView horizontal={true} style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                    {data.length > 0 && data.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleSelect(item)}
                            style={[styles.item, { backgroundColor: select && item.quiz_title === select.quiz_title ? 'crimson' : '#C0C0C0' }]}>
                            <Text>{item.quiz_title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
                {/* Render ProgressChart only if select is not null */}
                {select && <MyProgressChart name={select} />}</> : <ActivityIndicator size={'large'} color={'blue'} style={{flex:1, justifyContent:'center', alignItems : 'center'}} />}
        </>
    );
};

export default Report;

const styles = StyleSheet.create({
    mainContainer: {
        // flex: 1,
        // marginTop: 120,
        // flexDirection: 'column'
    },
    backButton: {
        marginLeft: 15,
        display: 'flex',
        flexDirection: 'row',
        marginTop: 130,
        width: '90%',
        justifyContent: 'flex-start'
    },
    scrollView: {
        marginTop: 10,
        flexDirection: 'row', // Ensures the children are laid out horizontally
        // backgroundColor: 'red',
        width: '95%',
        alignSelf: 'center'
    },
    item: {
        width: 100,
        height: 50,
        borderRadius: 25,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
