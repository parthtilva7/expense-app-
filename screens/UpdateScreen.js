import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { Text, Button } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import format from "date-fns/format";
import { Picker } from "@react-native-picker/picker";
import {
  auth,
  db,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "../firebase";
import parse from "date-fns/parse";

const UpdateScreen = ({ route, navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const { itemId } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Update Expense",
    });
  }, [navigation]);

  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const docRef = doc(db, "expense", itemId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setInput(snapshot.data()?.text);
      setAmount(snapshot.data()?.price);
      setSelDate(parse(snapshot.data()?.userDate, "dd/MM/yyyy", new Date()));
      setSelectedLanguage(snapshot.data()?.type);
    });

    return () => unsubscribe();
  }, []);

  const updateExpense = () => {
    if (input && amount && selDate && selectedLanguage) {
      setSubmitLoading(true);
      const expenseRef = doc(db, "expense", itemId);
      updateDoc(expenseRef, {
        text: input,
        price: amount,
        date: selDate,
        type: selectedLanguage,
        timestamp: serverTimestamp(),
        userDate: result,
      })
        .then(() => clearInputFields())
        .catch((error) => alert(error.message))
        .finally(() => setSubmitLoading(false));
    } else {
      setSubmitLoading(false);
      alert("All fields are mandatory");
    }
  };

  const clearInputFields = () => {
    alert("Updated Successfully");
    setInput("");
    setAmount("");
    setSelDate(new Date());
    setSelectedLanguage("expense");
    navigation.goBack();
    setSubmitLoading(false);
  };

  const [selDate, setSelDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setSelDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const result = format(selDate, "dd/MM/yyyy");

  const [selectedLanguage, setSelectedLanguage] = useState();

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add Text"
            placeholderTextColor="#888"
            value={input}
            onChangeText={(text) => setInput(text)}
          />

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selDate}
              mode={mode}
              display="default"
              onChange={onChange}
            />
          )}

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Add Amount"
            placeholderTextColor="#888"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />

          <Text
            style={styles.input}
            placeholder="Select Date"
            onPress={showDatepicker}
          >
            {result ? result : new Date()}
          </Text>

          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          >
            <Picker.Item label="Expense" value="expense" />
            <Picker.Item label="Income" value="income" />
          </Picker>

          <Button
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            title="Update"
            onPress={updateExpense}
            loading={submitLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default UpdateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
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
    borderBottomWidth: 1,
    marginBottom: 20,
    color: "black", // Ensure the input text is black
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
