import { StyleSheet, Text, View, Modal, TextInput, Button } from 'react-native'
import React from 'react'

const CourseModal = (props) => {

    return (
        <Modal
            visible={props.modalVisible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Create Course</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Class 8: Math"
                        value={props.courseName}
                        onChangeText={(text) => {props.setCourseName(text)}}
                    />
                    <TextInput
                        style={styles.input2}
                        multiline
                        numberOfLines={4}
                        placeholder="Write short description"
                        value={props.courseDescription}
                        onChangeText={(text) => {props.setCourseDescription(text)}}
                    />
                    <View style={styles.modalButtons}>
                        <Button title="Create" onPress={props.addCourse} color={'green'} />
                        <Button title="Close" onPress={() => { props.setModalVisible(false) }} color={'red'} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default CourseModal

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    input2: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
})