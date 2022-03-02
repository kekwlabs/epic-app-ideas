import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import axios from "axios";
import { Card, Button } from "react-native-elements";
import { useState, useEffect } from "react";
import { post, Posts } from "./types";
import { openBrowserAsync } from "expo-web-browser";
import RenderHtml from "react-native-render-html";
import he from "he";

export default function App() {
  const [index, setIndex] = useState(1);
  const [posts, setPosts] = useState([{} as post]);
  const { width } = useWindowDimensions();
  const fetchPosts = () => {
    axios
      .get("https://www.reddit.com/r/appideas/new/.json?limit=100")
      .then((res) => {
        const postsToRender: Posts = [{} as post];
        postsToRender.pop();
        res.data.data.children.forEach((child: any) => {
          postsToRender.push({
            title: child.data.title,
            url: child.data.url,
            text: child.data.selftext_html,
          });
        });
        setPosts(postsToRender);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          {posts.length > 0 && posts[index] ? (
            <>
              <Card containerStyle={styles.card}>
                <Card.Title>{posts[index].title}</Card.Title>
                <Card.Divider />
                {posts[index].text ? (
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: he.decode(posts[index].text),
                    }}
                  />
                ) : null}
                <View style={styles.buttonsContainer}>
                  <Button
                    containerStyle={styles.buttonContainerStyles}
                    buttonStyle={styles.buttonStyle}
                    titleStyle={styles.buttonTitleStyle}
                    title={"Link"}
                    onPress={() => {
                      openBrowserAsync(posts[index].url);
                    }}
                  />
                </View>
              </Card>
              <View style={styles.buttonsContainer}>
                <Button
                  containerStyle={styles.buttonContainerStyles}
                  titleStyle={styles.buttonTitleStyle}
                  title={"Back"}
                  onPress={() => {
                    if (index < posts.length) {
                      setIndex(index - 1);
                    }
                  }}
                />
                <Button
                  containerStyle={styles.buttonContainerStyles}
                  titleStyle={styles.buttonTitleStyle}
                  title={"Next"}
                  onPress={() => {
                    if (index < posts.length) {
                      setIndex(index + 1);
                    }
                  }}
                />
              </View>
            </>
          ) : (
            <>
              <ActivityIndicator />
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    alignContent: "center",
  },
  card: {
    borderRadius: 25,
    width: "80%",
  },
  text: {
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainerStyles: {
    margin: 20,
  },
  buttonStyle: {
    backgroundColor: "black",
    borderRadius: 50,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonTitleStyle: {},
});
