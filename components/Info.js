import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { STATUS } from "../services/constants";
import { COLOR } from "../services/style";

export default class Info extends Component {
  state = {
    messages: [],
  };

  constructor(props) {
    super(props);
    this.width = Dimensions.get("window").width;
    this.height = Dimensions.get("window").height;
  }

  createMessage = async (text, status) => {
    const { messages } = this.state;
    const newMessage = {
      id: messages.length ? messages[messages.length - 1].id + 1 : 1,
      text,
      status,
    };
    await this.setState({ messages: [newMessage, ...this.state.messages] });
    await setTimeout(async () => await this.deleteMessage(newMessage.id), 3000);
  };

  deleteMessage = async (id) => {
    const { messages } = this.state;
    const index = messages.findIndex((message) => message.id === id);
    messages.splice(index, 1);
    await this.setState({ messages });
  };

  render() {
    const { messages } = this.state;

    if (!messages.length) return null;

    return (
      <View
        style={[
          styles.container,
          { width: this.width, padding: this.width * 0.025 },
        ]}
      >
        {messages.map((message) => {
          return (
            <View
              key={message.id + message.text + Math.random()}
              style={[
                styles.info,
                styles[message.status + "Bg"],
                {
                  paddingHorizontal: this.height * 0.025,
                  paddingVertical: this.width * 0.05,
                },
              ]}
            >
              {message.status === STATUS.NORMAL && (
                <Feather
                  name="info"
                  size={20}
                  style={{ marginRight: 10 }}
                  color={COLOR.BLUE}
                />
              )}
              {message.status === STATUS.SUCCESS && (
                <Feather
                  name="check-circle"
                  size={20}
                  style={{ marginRight: 10 }}
                  color={COLOR.GREEN}
                />
              )}
              {message.status === STATUS.ERROR && (
                <Feather
                  name="alert-circle"
                  size={20}
                  style={{ marginRight: 10 }}
                  color={COLOR.RED}
                />
              )}
              <Text style={styles[message.status + "Text"]}>
                {message.text}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    zIndex: 999,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 6,
    marginBottom: 10,
  },
  normalBg: { backgroundColor: COLOR.BLUE_SOFT },
  successBg: { backgroundColor: COLOR.GREEN_SOFT },
  errorBg: { backgroundColor: COLOR.RED_SOFT },
  normalText: { color: COLOR.BLUE },
  successText: { color: COLOR.GREEN },
  errorText: { color: COLOR.RED },
});
