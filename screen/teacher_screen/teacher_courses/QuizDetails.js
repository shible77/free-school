import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { firebase } from './../../../config'
import Toast from '../../../components/Toast';
const QuizDetails = ({ route, navigation }) => {
    const quiz_id = route.params.quizId
    const course_id = route.params.courseId

    // console.log(quiz_id, course_id)
    const [questions, setQuestions] = useState([])
    const [saveButton, setSaveButton] = useState(false)
    const [showToast, setShowToast] = useState(false)

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const unsubscribe = firebase.firestore().collection('courses').doc(course_id).collection('quizzes').doc(quiz_id).onSnapshot((querySnapshot) => {
                    const quiz = querySnapshot.data()
                    setQuestions(quiz.questions)
                })
                return () => {
                    unsubscribe()
                }
            } catch (err) {
                console.log(err.message)
            }
        }
        fetchQuestions()
    }, [])

    const handleSave = async () => {
        try {
            await firebase.firestore().collection('courses').doc(course_id).collection('quizzes').doc(quiz_id).update({
                questions: questions
            })
            .then(() => {
                setShowToast(true)
                setTimeout(() => {
                    setShowToast(false)
                }, 4000)
            })
            .catch((err) => {
                console.log(err.message)
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    // console.log(questions)

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <FontAwesome5 name="arrow-left" size={25} color="black" />
                {/* <Text style={{ fontSize: 16 }}> Go Back</Text> */}
            </TouchableOpacity>
            <View style={styles.heading}>
                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                    <FontAwesome6 name="clipboard-question" size={30} color="black" />
                    <Text style={{ fontSize: 25 }}> Your Questions</Text>
                </View>
                <TouchableOpacity onPress={() => { saveButton === true ? handleSave() : null, setSaveButton(!saveButton) }}>
                    {saveButton === false ? <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', marginTop: 5 }}>
                        <Feather name="edit" size={24} color="black" />
                        <Text style={{ fontSize: 16, marginVertical: 2 }}>EDIT</Text>
                    </View> : <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', marginTop: 5 }}>
                        <AntDesign name="save" size={24} color="black" />
                        <Text style={{ fontSize: 16, marginVertical: 2 }}>SAVE</Text>
                    </View>}
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                {questions.length > 1 &&
                    questions.map((q, index) => {
                        return (
                            <View key={index} style={styles.qCard}>
                                <Text style={styles.headingText}>Question {index + 1}: </Text>
                                <TextInput
                                    style={styles.textarea}
                                    multiline={true}
                                    numberOfLines={4}
                                    placeholder="Write Your Question Here"
                                    editable={saveButton}
                                    placeholderTextColor={saveButton ? 'black' : 'dimgray'}
                                    textAlignVertical="top"
                                    cursorColor={'black'}
                                    value={questions[index].question}
                                    onChangeText={(text) => {
                                        setQuestions(prevQuestions => {
                                            return prevQuestions.map((question, idx) => {
                                                if (idx === index) {
                                                    return { ...question, question: text };
                                                }
                                                return question;
                                            });
                                        });
                                    }}
                                />

                                <Text style={styles.headingText}>Options:</Text>
                                <TextInput
                                    style={styles.TextInput}
                                    cursorColor={'black'}
                                    placeholder={'Option 1'}
                                    editable={saveButton}
                                    placeholderTextColor={saveButton ? 'black' : 'dimgray'}
                                    value={questions[index].option1}
                                    onChangeText={(text) => {
                                        setQuestions(prevQuestions => {
                                            return prevQuestions.map((question, idx) => {
                                                if (idx === index) {
                                                    return { ...question, option1: text };
                                                }
                                                return question;
                                            });
                                        });
                                    }}
                                />
                                <TextInput
                                    style={styles.TextInput}
                                    cursorColor={'black'}
                                    placeholder={'Option 2'}
                                    editable={saveButton}
                                    placeholderTextColor={saveButton ? 'black' : 'dimgray'}
                                    value={questions[index].option2}
                                    onChangeText={(text) => {
                                        setQuestions(prevQuestions => {
                                            return prevQuestions.map((question, idx) => {
                                                if (idx === index) {
                                                    return { ...question, option2: text };
                                                }
                                                return question;
                                            });
                                        });
                                    }}
                                />
                                <TextInput
                                    style={styles.TextInput}
                                    cursorColor={'black'}
                                    placeholder={'Option 3'}
                                    editable={saveButton}
                                    placeholderTextColor={saveButton ? 'black' : 'dimgray'}
                                    value={questions[index].option3}
                                    onChangeText={(text) => {
                                        setQuestions(prevQuestions => {
                                            return prevQuestions.map((question, idx) => {
                                                if (idx === index) {
                                                    return { ...question, option3: text };
                                                }
                                                return question;
                                            });
                                        });
                                    }}
                                />
                                <TextInput
                                    style={styles.TextInput}
                                    cursorColor={'black'}
                                    placeholder={'Option 4'}
                                    editable={saveButton}
                                    placeholderTextColor={saveButton ? 'black' : 'dimgray'}
                                    value={questions[index].option4}
                                    onChangeText={(text) => {
                                        setQuestions(prevQuestions => {
                                            return prevQuestions.map((question, idx) => {
                                                if (idx === index) {
                                                    return { ...question, option4: text };
                                                }
                                                return question;
                                            });
                                        });
                                    }}
                                />
                                <Text style={styles.headingText}>Correct Answer: </Text>
                                <TextInput
                                    style={[styles.TextInput, { marginBottom: 20 }]}
                                    cursorColor={'black'}
                                    placeholder={'Correct Option'}
                                    editable={saveButton}
                                    placeholderTextColor={saveButton ? 'black' : 'dimgray'}
                                    value={questions[index].answer}
                                    onChangeText={(text) => {
                                        setQuestions(prevQuestions => {
                                            return prevQuestions.map((question, idx) => {
                                                if (idx === index) {
                                                    return { ...question, answer: text };
                                                }
                                                return question;
                                            });
                                        });
                                    }}
                                />
                            </View>
                        )
                    })
                }
                <View style={{ height: 30 }}></View>
            </ScrollView>
            {showToast && <Toast
                icon={<AntDesign name="checkcircle" size={27} color="white" />}
                message='Changes Saved Successfully'
                color="green"
                bottom={30} />}
        </View>
    )
}

export default QuizDetails

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column'
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
    heading: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
        width: '90%',
        marginBottom: 10,
    },

    content: {
        marginTop: 10,
        width: '100%',
        alignSelf: 'center',
        // flex: 1
        marginBottom: 10

    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '90%',
        marginTop: 10
    },
    flatListContainer: {
        height: 70,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        margin: 10,
        padding: 10,
        marginBottom: 5
    },
    qCard: {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '95%',
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: 'gainsboro',
        marginBottom: 10,
        padding: 5
    },
    headingText: {
        width: '95%',
        alignSelf: 'center',
        fontSize: 17
    },
    TextInput: {
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#F5FCFF',
        width: '95%',
        alignSelf: 'center',
        fontSize: 18,
        height: 50,
        marginBottom: 5
    },
    textarea: {
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#F5FCFF',
        width: '95%',
        alignSelf: 'center',
        fontSize: 18,
        height: 80,
        marginBottom: 5
    },
})