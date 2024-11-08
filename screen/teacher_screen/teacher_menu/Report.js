import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { firebase } from '../../../config';
import MyBarChart from '../../../components/MyBarChart';



const Report = ({ navigation }) => {

    const [data, setData] = useState([])
    const [select, setSelect] = useState(null)
    const [loading, setLoading] = useState(false)
    const fetchCourseRating = async () => {
        const coursesWithRating = []
        setLoading(true)
        const coursesDoc = await firebase.firestore().collection('courses').where('teacher_id', '==', firebase.auth().currentUser.uid).get()
        coursesDoc.docs.forEach((doc, index) => {
            const courseObject = {
                course_title: doc.data().title,
                one_star: doc.data().one ? doc.data().one.length : 0,
                two_star: doc.data().two ? doc.data().two.length : 0,
                three_star: doc.data().three ? doc.data().three.length : 0,
                four_star: doc.data().four ? doc.data().four.length : 0,
                five_star: doc.data().five ? doc.data().five.length : 0
            }
            coursesWithRating.push(courseObject)
        })
        setData(coursesWithRating)
        setSelect(coursesWithRating[0])
        setLoading(false)
    }
    useEffect(() => {
        fetchCourseRating()
    }, [])

    const handleSelect = (item) => {
        setSelect(item);
    };

    // console.log(select)
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <FontAwesome5 name="arrow-left" size={25} color="black" />
                {/* <Text style={{ fontSize: 16 }}> Go Back</Text> */}
            </TouchableOpacity>
            {loading === false ? <View style={styles.page}>
                <ScrollView horizontal={true} style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                    {data.length > 0 && data.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleSelect(item)}
                            style={[styles.item, { backgroundColor: select && item.course_title === select.course_title ? 'crimson' : '#C0C0C0' }]}>
                            <Text>{item.course_title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                {data.length < 1 &&  <View style={{height : '50%', width : '90%', alignSelf : 'center', justifyContent : 'center', alignItems : 'center'}}>
                    <Text style={{ fontSize: 25}}>No data Available!</Text>
                </View>}
                {select && <MyBarChart data={select} />}
            </View> : <ActivityIndicator size={'large'} color={'blue'} />}
        </View>
    )
}

export default Report

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    backButton: {
        marginLeft : 5,
        display: 'flex',
        flexDirection: 'row',
        marginTop: 45,
        width: 50,
        justifyContent: 'center',
        height : 50,
        // backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems : 'center',
        borderRadius : 25,
        padding : 5,  
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, 
        shadowRadius: 3.84,
        elevation: 5
    },
    item: {
        width: 150,
        height: 70,
        borderRadius: 35,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    page : {
        marginTop: 10,
        width : "95%",
        alignSelf : 'center'
    }
})