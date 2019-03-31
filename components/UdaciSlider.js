import React from "react";
import { View, Slider, Text, StyleSheet } from "react-native";
import { white, gray, purple } from "../utils/colors";

export default function UdaciSlider({ unit, value, max, onChange, step }) {
  return (
    <View style={styles.container}>
      <Slider
        value={value}
        step={step}
        maximumValue={max}
        minimumValue={0}
        onValueChange={onChange}
        style={styles.slider}
      />
      <View style={styles.metricCounter}>
        <Text style={{ fontSize: 24, textAlign: "center" }}>{value}</Text>
        <Text style={{ fontSize: 18, color: gray }}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  slider: {
    flex: 1
  },
  metricCounter: {
    width: 85,
    justifyContent: "center",
    alignItems: "center"
  },
})
