import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { Text, Avatar } from "react-native-elements";
import { auth, db, onSnapshot, query, collection, orderBy } from "../firebase";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import CustomListItem from "../components/CustomListItem";

const AllTransactions = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "expense"), orderBy("timestamp", "desc")),
      (snapshot) => {
        const allTransactions = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setTransactions(allTransactions);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (transactions) {
      setFilter(
        transactions.filter(
          (transaction) => transaction.data.email === auth.currentUser.email
        )
      );
    }
  }, [transactions]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Avatar
          size="medium"
          rounded
          source={{
            uri: auth?.currentUser?.photoURL,
          }}
          containerStyle={styles.avatar}
        />
        <Text style={styles.headerText}>
          Hi, {auth.currentUser.displayName}
        </Text>
      </View>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceText}>All Transactions</Text>
      </View>
      <ScrollView style={styles.transactionList}>
        {filter.map((info) => (
          <CustomListItem
            key={info.id}
            info={info.data}
            navigation={navigation}
            id={info.id}
          />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.footerIcon}
        >
          <AntDesign name="home" size={24} color="#2C6BED" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Add")}
          style={styles.addButton}
        >
          <AntDesign name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("All")}
          style={styles.footerIcon}
        >
          <FontAwesome5 name="list-alt" size={24} color="#2C6BED" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AllTransactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    color: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#2C6BED",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 80,
  },
  avatar: {
    marginRight: 10,
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  balanceCard: {
    backgroundColor: "#FFF",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceText: {
    fontSize: 18,
    color: "#555",
  },
  transactionList: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  footerIcon: {
    padding: 10,
  },
  addButton: {
    backgroundColor: "#2C6BED",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});
