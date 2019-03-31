import React from "react";
import { Text, StyleSheet } from "react-native";
import { purple } from "../utils/colors";

export default function DateHeader({ date }) {
  return <Text style={style.headerText}> {date} </Text>;
}

const style = StyleSheet.create({
  headerText: {
    color: purple,
    fontSize: 25
  }
})
