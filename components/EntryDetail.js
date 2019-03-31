import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { white } from "../utils/colors";
import MetricCard from "./MetricCard";
import { addEntry } from "../actions";
import { removeEntry } from "../utils/api";
import { timeToString, getDailyReminderValue } from "../utils/api";
import TextButton from "./TextButton";

class EntryDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    const { entryId } = navigation.state.params;
    const year = entryId.slice(0, 4);
    const month = entryId.slice(5, 7);
    const day = entryId.slice(8);

    return {
      title: `${day}/${month}/${year}`
    };
  };

  reset = () => {
    const { remove, goBack, entryId } = this.props;
    remove();
    removeEntry(entryId);
    goBack();
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.metrics !== null && !nextProps.metrics.today;
  }

  render() {
    const { metrics } = this.props;
    return (
      <View style={styles.container}>
        <MetricCard metrics={metrics} />
        <TextButton style={{ padding: 20 }} onPress={this.reset}>
          Reset
        </TextButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: white
  }
});

function mapStateToProps(state, { navigation }) {
  const { entryId } = navigation.state.params;
  const entry = state[entryId];
  return {
    entryId,
    metrics: entry
  };
}

function mapDispatchToProps(dispatch, { navigation }) {
  const { entryId } = navigation.state.params;
  return {
    remove: () => {
      dispatch(
        addEntry({
          [entryId]: timeToString === entryId ? getDailyReminderValue() : null
        })
      );
    },
    goBack: () => navigation.goBack()
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryDetail);
