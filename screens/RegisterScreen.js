import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { Input, Button, Text, Image } from "react-native-elements";
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "../firebase";

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to Login",
    });
  }, [navigation]);

  const signUp = async () => {
    if (fullName && email && password) {
      setSubmitLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: fullName,
          photoURL:
            imageUrl ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVe0cFaZ9e5Hm9X-tdWRLSvoZqg2bjemBABA&usqp=CAU",
        });
        clearInputFields();
      } catch (error) {
        console.error(error.message);
        alert(error.message);
        setSubmitLoading(false);
      }
    } else {
      alert("All fields are mandatory");
      setSubmitLoading(false);
    }
  };

  const clearInputFields = () => {
    alert("Successfully Created Account");
    navigation.replace("Home");
    setSubmitLoading(false);
    setFullName("");
    setEmail("");
    setPassword("");
    setImageUrl("");
  };

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
          Create an account
        </Text>
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={fullName}
            onChangeText={(text) => setFullName(text)}
            inputContainerStyle={styles.input}
          />
          <Input
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={(text) => setEmail(text)}
            inputContainerStyle={styles.input}
          />
          <Input
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            inputContainerStyle={styles.input}
          />
          <Input
            placeholder="Profile Picture Url (Optional)"
            placeholderTextColor="#888"
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
            inputContainerStyle={styles.input}
            onSubmitEditing={signUp}
          />
        </View>
        <Button
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          title="Register"
          onPress={signUp}
          loading={submitLoading}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

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
});
