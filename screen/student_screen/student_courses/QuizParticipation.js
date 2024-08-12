import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { firebase } from '../../../config'


const QuizParticipation = ({ route, navigation }) => {
    const {quizId, courseId} = route.params
    console.log(quizId, courseId)
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState(Array(10).fill(null));
    const [totalMark, setTotalMark] = useState(0);
    const [submit, setSubmit] = useState(false)
    const [checkAnswer, setCheckAnswer] = useState([])
    const [previousScore, setPreviousScore] = useState(0)
    const [alreadyParticipated, setAlreadyParticipated] = useState(false)

    useEffect(() => {
        const unsubscribe = firebase.firestore()
            .collection('courses')
            .doc(courseId)
            .collection('quizzes')
            .doc(quizId)
            .onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    const fetchedQuestions = snapshot.data().questions;
                    setQuestions(fetchedQuestions);
                    if(snapshot.data().userID_along_mark){
                        const filteredData = snapshot.data().userID_along_mark.filter(item => item.uid === firebase.auth().currentUser.uid)
                        if(filteredData.length === 1){
                            setPreviousScore(filteredData[0].mark)
                            setAlreadyParticipated(true)
                        }
                    }
                } else {
                    // Document doesn't exist, handle accordingly
                    console.log("Document does not exist");
                }
            });

        // Cleanup function to unsubscribe from the snapshot listener when component unmounts
        return () => unsubscribe();
    }, [courseId, quizId]);

    // console.log(questions)
    const handleOptionSelect = (index, optionValue) => {
        const newAnswers = [...answers];
        newAnswers[index] = optionValue.trim();
        setAnswers(newAnswers);
    };

    const handleSubmit = async() => {
        let mark = 0;
        const newAnswers = answers.map((userAnswer, index) => {
            const correctAnswer = questions[index].answer.trim();
            if (userAnswer === correctAnswer) {
                mark++;
            }
            return {
                userAnswer,
                correctAnswer
            };
        });
        setTotalMark(mark);
        setCheckAnswer(newAnswers)
        // console.log(newAnswers);
        const quizRef = firebase.firestore()
        .collection('courses')
        .doc(courseId)
        .collection('quizzes')
        .doc(quizId)
       
        try{
            await quizRef.update({
                userID_along_mark : firebase.firestore.FieldValue.arrayUnion({
                    uid: firebase.auth().currentUser.uid,
                    mark: mark
                })
            })
        }catch(err){
            console.log(err)
        }

    };


    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <FontAwesome5 name="arrow-left" size={20} color="black" />
                <Text style={{ fontSize: 16 }}> Go Back</Text>
            </TouchableOpacity>
            <View style={styles.heading}>
                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                    <MaterialIcons name="question-answer" size={30} color="black" />
                    <Text style={{ fontSize: 25 }}> Answer The Quiz</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {questions.map((question, index) => (
                    <View key={index} style={styles.questionContainer}>
                        <Text style={styles.questionText}>{question.question}</Text>
                        <TouchableOpacity style={[styles.optionButton, {
                            backgroundColor:
                                submit === false ? answers[index] === question.option1.trim() ? 'gray' : 'white' : checkAnswer[index].correctAnswer === question.option1.trim() ? 'green' : checkAnswer[index].userAnswer === question.option1.trim() ? 'red' : 'white',
                            borderColor:
                                answers[index] === question.option1.trim() ? 'gray' : '#000'
                        }]} onPress={() => handleOptionSelect(index, question.option1)}>
                            <Text>{question.option1}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.optionButton, {
                            backgroundColor:
                                submit === false ? answers[index] === question.option2.trim() ? 'gray' : 'white' : checkAnswer[index].correctAnswer === question.option2.trim() ? 'green' : checkAnswer[index].userAnswer === question.option2.trim() ? 'red' : 'white',
                            borderColor:
                                answers[index] === question.option2.trim() ? 'gray' : '#000'
                        }]} onPress={() => handleOptionSelect(index, question.option2)}>
                            <Text>{question.option2}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.optionButton, {
                            backgroundColor:
                                submit === false ? answers[index] === question.option3.trim() ? 'gray' : 'white' : checkAnswer[index].correctAnswer === question.option3.trim() ? 'green' : checkAnswer[index].userAnswer === question.option3.trim() ? 'red' : 'white',
                            borderColor:
                                answers[index] === question.option3.trim() ? 'gray' : '#000'
                        }]} onPress={() => handleOptionSelect(index, question.option3)}>
                            <Text>{question.option3}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.optionButton, {
                            backgroundColor:
                                submit === false ? answers[index] === question.option4.trim() ? 'gray' : 'white' : checkAnswer[index].correctAnswer === question.option4.trim() ? 'green' : checkAnswer[index].userAnswer === question.option4.trim() ? 'red' : 'white',
                            borderColor:
                                answers[index] === question.option4.trim() ? 'gray' : '#000'
                        }]} onPress={() => handleOptionSelect(index, question.option4)}>
                            <Text>{question.option4}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={{ height: 165 }}>
                    {alreadyParticipated===false && <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 20 }}>Total Score: {totalMark}</Text>}
                    {alreadyParticipated && <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 20 }}>Your score was : {previousScore}</Text>}
                    {alreadyParticipated ? <View style={[styles.submitButton, {backgroundColor : 'gray'}]}>

                        <Text style={{fontSize : 20}}>You have already answered the quiz once</Text>
                    </View> : <TouchableOpacity style={styles.submitButton} onPress={() => { handleSubmit(), setSubmit(true) }}>
                        <Text style={{fontSize : 20}}>Submit</Text>
                    </TouchableOpacity>}
                </View>
            </ScrollView>
        </View>
    )
}

export default QuizParticipation

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
    questionContainer: {
        padding: 10,
        backgroundColor: 'silver',
        marginBottom: 10,
        borderRadius: 5
    },
    questionText: {
        fontSize: 18,
        marginBottom: 10
    },
    optionButton: {
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5
    },
    submitButton: {
        padding: 10,
        marginTop: 20,
        backgroundColor: 'seagreen',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height : 50
    },
    scrollContainer: {
        padding: 10,
        marginTop: 10
    }
})