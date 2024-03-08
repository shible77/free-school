import { StyleSheet, Text, View, Modal, TextInput, Button, ActivityIndicator } from 'react-native'
import React from 'react'

const UploadModal = (props) => {
    return (
        <Modal
            visible={props.isModalVisible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <>
                        <Text style={styles.modalTitle}>Upload video</Text>
                        <View style={styles.inputView}>
                            <Text style={styles.inputText}>Video Title: </Text>
                            <TextInput
                                placeholder='Chapter: 1, Sec: 1.1, Topic Name'
                                placeholderTextColor={'dimgray'}
                                cursorColor={'black'}
                                editable={true}
                                value={props.videoTitle}
                                onChangeText={(text) => { props.setVideoTitle(text) }}
                                style={styles.inputField}
                            />
                        </View>
                        <View style={styles.modalButtons}>
                            <Button title="Choose" onPress={() => { props.setIsModalVisible(false); props.pickVideo() }} color={'seagreen'} />
                            <Button title="Cancel" onPress={() => { props.setIsModalVisible(false) }} color={'red'} />
                        </View>
                    </>
                </View>
            </View>
        </Modal>
    )
}


export default UploadModal

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#28282B',
        padding: 20,
        borderRadius: 10,
        width: '95%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15
    },

    inputView: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignSelf: 'center',
        marginTop: 10
    },
    inputText: {
        fontSize: 16,
        color: 'white',
        alignSelf: 'flex-start',
    },
    inputField: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        padding: 5,
        paddingLeft: 10,
        alignSelf: 'center',
        margin: 5,
        fontSize: 18,
        borderRadius: 5
    }
})