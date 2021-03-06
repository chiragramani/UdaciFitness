import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet
} from "react-native";
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue,
  clearLocalNotification,
  setLocalNotification
} from "../utils/helpers";
import UdaciSlider from "./UdaciSlider";
import UdaciSteppers from "./UdaciSteppers";
import DateHeader from "./DateHeader";
import { Ionicons } from "@expo/vector-icons";
import TextButton from "./TextButton";
import { submitEntry, removeEntry } from "../utils/api";
import { connect } from "react-redux";
import { addEntry } from "../actions";
import { white, purple } from "../utils/colors";
import { NavigationActions } from "react-navigation";
function SubmitButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.androidSubmitBtn
      }
    >
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  );
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  };

  slide = (metric, value) => {
    this.setState(currentState => {
      return {
        ...currentState,
        [metric]: value
      };
    });
  };

  submit = e => {
    const key = timeToString();
    const entry = this.state;
    const { dispatch } = this.props;

    // Update Redux
    dispatch(
      addEntry({
        [key]: entry
      })
    );

    // Navigation To Home
    this.goToHome();

    // Save to "DB"
    submitEntry({
      key,
      entry
    });

    // Clear local notifications.
    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    });

    clearLocalNotification().then(setLocalNotification);
  };

  goToHome = () => {
    const { navigation } = this.props;
    navigation.dispatch(
      NavigationActions.back({
        key: "AddEntry"
      })
    );
  };

  increment = metric => {
    const { max, step } = getMetricMetaInfo(metric);
    this.setState(state => {
      const newCount = state[metric] + step;
      return {
        ...state,
        [metric]: newCount > max ? max : newCount
      };
    });
  };

  decrement = metric => {
    const { step } = getMetricMetaInfo(metric);
    this.setState(currentState => {
      const newCount = currentState[metric] - step;
      return {
        ...currentState,
        [metric]: newCount >= 0 ? newCount : currentState[metric]
      };
    });
  };

  reset = () => {
    const key = timeToString();
    // Update Redux
    const { dispatch } = this.props;
    dispatch(
      addEntry({
        [key]: getDailyReminderValue()
      })
    );

    // Navigation To
    this.goToHome();

    // Save to "DB"
    removeEntry(key);
  };

  render() {
    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.os === "ios" ? "ios-happy" : "md-happy"}
            size={100}
          />
          <Text>Your aleady logged your information for today</Text>
          <TextButton style={{ padding: 20 }} onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      );
    }
    const metaInfo = getMetricMetaInfo();
    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map(key => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];
          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === "slider" ? (
                <UdaciSlider
                  value={value}
                  onChange={value => this.slide(key, value)}
                  {...rest}
                />
              ) : (
                <UdaciSteppers
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          );
        })}
        <SubmitButton onPress={this.submit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 6,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 2,
    height: 45,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center"
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: "center"
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30,
    marginLeft: 30
  }
});

function mapStateToProps(state) {
  const key = timeToString();
  return {
    alreadyLogged: state[key] && typeof state[key].today === "undefined"
  };
}

export default connect(mapStateToProps)(AddEntry);
