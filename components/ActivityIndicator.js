import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { gsap, Power2, Elastic, AutoKillTweens } from 'gsap-rn';

const ActivityIndicator = () => {
  const circles = useRef([]);
  const tl = useRef();

  useEffect(() => {
 
   const animate = () => {
      AutoKillTweens.tweensOf(tl.current);
      tl.current = gsap.timeline();
      tl.current.to(circles.current, { duration: 0.5, transform: { y: -30, scale: 0.8 }, ease: Power2.easeInOut, stagger: { amount: 0.3 } });
      tl.current.to(circles.current, { duration: 1, transform: { y: 0, scale: 1 }, ease: Elastic.easeOut, stagger: { amount: 0.3 } });
    };

    animate();

    const intervalId = setInterval(animate, 2000);

    return () => {
      clearInterval(intervalId);
    
      if (tl.current) {
        tl.current.kill(); 
      }
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <AutoKillTweens tweens={tl.current} />
      <View style={{ flexDirection: "row" }}>
        <View ref={ref => circles.current.push(ref)} style={styles.circle} />
        <View ref={ref => circles.current.push(ref)} style={styles.circle} />
        <View ref={ref => circles.current.push(ref)} style={styles.circle} />
      </View>
      <View style={styles.textView}>
        <Text style={styles.text}>Please Wait...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: { width: 20, height: 20, backgroundColor: "#f0ad4e", marginHorizontal: 5, borderRadius: 10 },
  button: { fontSize: 20, backgroundColor: "#337ab7", paddingVertical: 10, paddingHorizontal: 20, color: "#FFF", borderRadius: 5 },
  textView: { alignSelf: 'center', marginTop: 10 },
  text: { fontSize: 18, color: 'gray' }
});

export default ActivityIndicator;
