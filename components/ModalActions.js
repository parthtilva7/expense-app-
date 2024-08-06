import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { db, doc, deleteDoc } from "../firebase";

const ModalActions = ({ modalVisible, setModalVisible, navigation, id }) => {
  const deleteExpense = () => {
    deleteDoc(doc(db, "expense", id))
      .then(() => alert("Deleted Successfully"))
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.closeIcon}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <AntDesign name="closecircle" size={24} color="black" />
            </Pressable>
            <View style={styles.logoContainer}>
              <MaterialIcons name="manage-accounts" size={50} color="#2C6BED" />
              <Text style={styles.functionalityText}>Manage Expense</Text>
            </View>
            <View style={styles.handleIcons}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.iconButton}
                onPress={() =>
                  navigation.navigate("Update", {
                    itemId: id,
                  }) & setModalVisible(!modalVisible)
                }
              >
                <MaterialIcons name="edit" size={32} color="#4CAF50" />
                <Text style={styles.iconText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.iconButton}
                onPress={() => deleteExpense()}
              >
                <MaterialIcons name="delete" size={32} color="#F44336" />
                <Text style={styles.iconText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalActions;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  functionalityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C6BED",
    marginTop: 10,
  },
  handleIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  iconButton: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    alignItems: "center",
  },
  iconText: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
  },
});
