import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { firebase } from '../../../config'
import ToastNotification from '../../../components/Toast';

const Quizzes = ({ route }) => {
    const navigation = useNavigation()
    const courseId = route.params.courseId;
    const [quizTitle, setQuizTitle] = useState('');
    const [quizTopic, setQuizTopic] = useState('');
    const [showToast1, setShowToast1] = useState(false)
    const [showToast2, setShowToast2] = useState(false)
    const [questions, setQuestions] = useState([
        {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: ''
        },
        {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: ''
        },
        {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: ''
        },
        {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: ''
        },
        {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: ''
        },
        {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: ''
        },
        {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: ''
        },
        {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: ''
        },
        {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: ''
        },
        {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: ''
        }

    ])

    const checkQuestions = () => {
        let isAnyEmpty = false;
      
        questions.forEach((q, index) => {
          const { question, option1, option2, option3, option4, answer } = q;
          if (question === '' || option1 === '' || option2 === '' || option3 === '' || option4 === '' || answer === '') {
            isAnyEmpty = true;
          }
        });
      
        return isAnyEmpty;
      };

    const storeQuiz = async() => {
        if(quizTitle === '' || quizTopic === '' || checkQuestions()) {
            setShowToast1(true);
            setTimeout(() => {
                setShowToast1(false)
            },4000)
            return;
        }
        await firebase.firestore().collection('courses').doc(courseId).collection('quizzes').add({
            title: quizTitle,
            topic: quizTopic,
            questions: questions
        })
        .then((docRef) => {
            docRef.update({quiz_id: docRef.id})
            .then(() => {
                setShowToast2(true);
                setTimeout(() => {
                    setShowToast2(false)
                    setQuizTitle('')
                    setQuizTopic('')
                    setQuestions([
                        {
                            question: '',
                            option1: '',
                            option2: '',
                            option3: '',
                            option4: '',
                            answer: ''
                        },
                        {
                            question: '',
                            option1: '',
                            option2: '',
                            option3: '',
                            option4: '',
                            answer: ''
                        },
                        {
                            question: '',
                            option1: '',
                            option2: '',
                            option3: '',
                            option4: '',
                            answer: ''
                        },
                        {
                            question: '',
                            option1: '',
                            option2: '',
                            option3: '',
                            option4: '',
                            answer: ''
                        },
                        {
                            question: '',
                            option1: '',
                            option2: '',
                            option3: '',
                            option4: '',
                            answer: ''
                        },
                        {
                            question: '',
                            option1: '',
                            option2: '',
                            option3: '',
                            option4: '',
                            answer: ''
                        },
                        {
                            question: '',
                            option1: '',
                            option2: '',
                            option3: '',
                            option4: '',
                            answer: ''
                        },
                        {
                            question: '',
                            option1: '',
                            option2: '',
                            option3: '',
                            option4: '',
                            answer: ''
                        },
                        {
                            question: '',
                            option1: '',
                            option2: '',
                            option3: '',
                            option4: '',
                            answer: ''
                        },
                        {
                            question: '',
                            option1: '',
                            option2: '',
                            option3: '',
                            option4: '',
                            answer: ''
                        }
                    ])
                },4000)
            }).catch(err => {
                console.log(err.message)
            })
        }).catch(err => {
            console.log(err.message)
        })
    }

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <FontAwesome5 name="arrow-left" size={25} color="black" />
                {/* <Text style={{ fontSize: 16 }}> Go Back</Text> */}
            </TouchableOpacity>
            <View style={styles.heading}>
                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                    <MaterialIcons name="post-add" size={30} color="black" />
                    <Text style={{ fontSize: 25 }}>Create Quiz</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.qCard}>
                    <Text style={styles.headingText}>Title of the Quiz:</Text>
                    <TextInput 
                        style={styles.TextInput}
                        cursorColor={'black'}
                        placeholder={'Title of the Quiz'}
                        value={quizTitle}
                        onChangeText={(text) => setQuizTitle(text)}
                    />
                    <Text style={styles.headingText}>Topic of the Quiz:</Text>
                    <TextInput 
                        style={styles.TextInput}
                        cursorColor={'black'}
                        placeholder={'Topic of the Quiz'}
                        value={quizTopic}
                        onChangeText={(text) => setQuizTopic(text)}
                    />
                </View>
                {questions.map((item, index) => (
                    <View key={index} style={styles.qCard}>
                        <Text style={styles.headingText}>Question {index + 1}: </Text>
                        <TextInput
                            style={styles.textarea}
                            multiline={true}
                            numberOfLines={4}
                            placeholder="Write Your Question Here"
                            placeholderTextColor="gray"
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
                ))}
                <View style={{ height: 90 }}>
                    <TouchableOpacity style={styles.button} onPress={() => {storeQuiz()}}>
                        <Text style={{ fontSize: 20, color: 'white' }}>Create</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            {showToast1 ? <ToastNotification color={'red'} message={'You can not leave any field empty'} bottom={55} icon={<MaterialIcons name="error-outline" size={27} color="white" />} /> : null}
            {showToast2 ? <ToastNotification color={'green'} message={'Quiz Created Successfully'} bottom={55} icon={<AntDesign name="checkcircle" size={27} color="white" />} /> : null}
        </View>
    )
}

export default Quizzes

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // marginTop: 120,
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
        marginBottom: 10
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
    button: {
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        backgroundColor: 'darkcyan',
        alignSelf: 'center',
        height: 50,
        marginTop: 10
    }
})