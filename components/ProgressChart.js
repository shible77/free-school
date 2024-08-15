import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { ProgressChart } from "react-native-chart-kit";

const MyProgressChart = (props) => {
  // console.log(props.name)

  const data = {
    labels: ["Accuracy"], // optional
    data: [(props.name.mark/10)]
  };

  const remark = ["Unsatisfactory","Poor","Weak","Below Average","Average","Fair","Good","Very Good","Excellent", "Outstanding"]

  const chartConfig = {
    backgroundGradientFrom: "#696969",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#808080",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(30,144,255, ${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.myTitle}>{'Quiz Title : '+props.name.quiz_title}</Text>
        <Text style={[styles.myTitle, {marginTop : 10}]}>{'Quiz Topic : '+props.name.quiz_topic}</Text>
      </View>
      <View style={styles.details}>
          <Text style={styles.dText}>{"You have participated in this quiz and obtain "+props.name.mark+" out of 10. Your accuracy in percentage is given below:"}</Text>
      </View>
      <View style={styles.pChart}>
        <ProgressChart
          data={data}
          width={Dimensions.get("window").width - 20}
          height={220}
          strokeWidth={30}
          radius={80}
          chartConfig={chartConfig}
          hideLegend={true}
        />
        <Text style={styles.myText}>{data.data[0] * 100 + '%'}</Text>
      </View>
      <Text style={styles.remark}>{"Remark : "+ remark[props.name.mark-1 < 0 ? 0 : props.name.mark-1]}</Text>
    </View>
  )
}

export default MyProgressChart

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pChart:{
    marginTop : 20,
    justifyContent : 'center',
    alignItems : 'center'
  },
  myText: {
    position: 'absolute',
    fontSize: 20
  },
  myTitle : {
    fontSize : 22,
    display : 'flex',
    alignSelf : 'flex-start',
    color : 'crimson'
  },
  heading : {
    marginTop : 20,
    width : '100%'
  },
  details : {
    width : '100%',
    marginTop : 20,
  },
  dText : {
    fontSize : 18,
    color : 'black'
  },
  remark  :{
    fontSize : 20,
    marginTop : 20,
    fontWeight : 'bold'
  }
})