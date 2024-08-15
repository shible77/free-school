import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { BarChart } from "react-native-chart-kit";

const MyBarChart = (props) => {
    const screenWidth = Dimensions.get('window').width;
    // console.log(props.data)
    const data = {
        labels: ["One Star", "Two Star", "Three Star", "Four Star", "Five Star"],
        datasets: [
            {
                data: [props.data.one_star, props.data.two_star, props.data.three_star, props.data.four_star, props.data.five_star]
            }
        ]
    };

    const chartConfig = {
        backgroundGradientFrom: "#FFFFFF",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#FFFFFF",
        backgroundGradientToOpacity: 0,
        color: (opacity = 0) => `rgba(0,0,0, ${opacity})`,
        strokeWidth: 5, // optional, default 3
        barPercentage: 1.2,
        useShadowColorFromDataset: false // optional
    };
    return (
        <View style={styles.container}>
            <BarChart
                //style={graphStyle}
                data={data}
                width={screenWidth-10}
                height={255}
                yAxisLabel=""
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                showValuesOnTopOfBars={true}
            />
        </View>
    )
}

export default MyBarChart

const styles = StyleSheet.create({
    container: {
        width: '95%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    }
})