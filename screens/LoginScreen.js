import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { Input, Button, Image, Text } from "react-native-elements";
import { auth, signInWithEmailAndPassword } from "../firebase";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const signIn = async () => {
    if (email && password) {
      setSubmitLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        clearInputFields();
      } catch (error) {
        alert(error.message);
        setSubmitLoading(false);
      }
    } else {
      alert("All fields are mandatory");
      setSubmitLoading(false);
    }
  };

  const clearInputFields = () => {
    alert("Successfully Logged in");
    navigation.replace("Home");
    setSubmitLoading(false);
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: loading ? "Loading..." : "Login",
    });
  }, [navigation, loading]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://static-s.aa-cdn.net/img/gp/20600011886807/to-aGJ31KLwqc9AWaBUyL6NLbpFwN9VEliX7nQ_AU48aO4jH6M1MltWKmThWJPndJg=s300?v=1",
          }}
          style={styles.logo}
        />
        <Text h4 style={styles.headerText}>
          Welcome Back!
        </Text>
      </View>
      {!loading ? (
        <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Email"
              placeholderTextColor="#888"
              inputStyle={{ color: "black" }}
              value={email}
              onChangeText={(text) => setEmail(text)}
              inputContainerStyle={styles.input}
            />
            <Input
              placeholder="Password"
              placeholderTextColor="#888"
              inputStyle={{ color: "white" }}
              value={password}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              inputContainerStyle={styles.input}
              onSubmitEditing={signIn}
            />
          </View>
          <Button
            loading={submitLoading}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            title="Login"
            onPress={signIn}
          />
          <Button
            onPress={() => navigation.navigate("Register")}
            containerStyle={styles.buttonContainer}
            buttonStyle={[styles.button, styles.registerButton]}
            title="Register"
            type="outline"
            titleStyle={{ color: "white" }}
          />
          <View style={{ height: 50 }} />
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.innerContainer}>
          <Text h4 style={styles.loadingText}>
            Loading...
          </Text>
        </View>
      )}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    backgroundColor: "#2C6BED",
    paddingVertical: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  headerText: {
    color: "white",
    marginBottom: 20,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "100%",
  },
  inputContainer: {
    width: 300,
  },
  input: {
    borderBottomColor: "#888",
  },
  buttonContainer: {
    width: 300,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#1E88E5",
    borderRadius: 20,
    paddingVertical: 10,
  },
  registerButton: {
    backgroundColor: "#6D4C41",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
  },
  loadingText: {
    color: "white",
  },
});
