import React, { Component } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";

export default class Loading extends Component {
  render() {
    return (
      <View style={styles.loading}>
        <View style={styles.loadingContent}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ marginBottom: 10 }}
          />
          <Text style={{ color: "black" }}>Loading..</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: 0,
    backgroundColor: "rgba(255,255,255,.5)",
    zIndex: 999999,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
  },
});
