import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { Text, Avatar } from "react-native-elements";
import { auth, db, onSnapshot, query, collection, orderBy } from "../firebase";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import CustomListItem from "../components/CustomListItem";

const HomeScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [filter, setFilter] = useState([]);

  const signOutUser = () => {
    auth
      .signOut()
      .then(() => navigation.replace("Login"))
      .catch((error) => alert(error.message));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Budget Tracker",
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
            <Text style={{ fontWeight: "bold", color: "#FFF" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#2C6BED",
      },
      headerTitleStyle: {
        color: "#FFF",
      },
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "expense"), orderBy("timestamp", "desc")),
      (snapshot) => {
        const allTransactions = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        const userTransactions = allTransactions.filter(
          (transaction) => transaction.data.email === auth.currentUser.email
        );

        const totalIncomeSum = userTransactions
          .filter((t) => t.data.type === "income")
          .reduce((acc, val) => acc + Number(val.data.price), 0);

        const totalExpenseSum = userTransactions
          .filter((t) => t.data.type === "expense")
          .reduce((acc, val) => acc + Number(val.data.price), 0);

        setTransactions(allTransactions);
        setTotalIncome(totalIncomeSum);
        setTotalExpense(totalExpenseSum);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    setTotalBalance(totalIncome - totalExpense);
  }, [totalIncome, totalExpense]);

  useEffect(() => {
    setFilter(
      transactions.filter(
        (transaction) => transaction.data.email === auth.currentUser.email
      )
    );
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
        <Text style={styles.greetingText}>
          Welcome, {auth.currentUser.displayName}
        </Text>
      </View>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceText}>Total Balance</Text>
        <Text style={styles.balanceAmount}>${totalBalance.toFixed(2)}</Text>
      </View>
      <View style={styles.incomeExpenseContainer}>
        <View
          style={[styles.incomeExpenseCard, { backgroundColor: "#4CAF50" }]}
        >
          <Feather name="arrow-down" size={24} color="#FFF" />
          <Text style={styles.incomeExpenseText}>Income</Text>
          <Text style={styles.incomeExpenseAmount}>
            ${totalIncome.toFixed(2)}
          </Text>
        </View>
        <View
          style={[styles.incomeExpenseCard, { backgroundColor: "#F44336" }]}
        >
          <Feather name="arrow-up" size={24} color="#FFF" />
          <Text style={styles.incomeExpenseText}>Expense</Text>
          <Text style={styles.incomeExpenseAmount}>
            ${totalExpense.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.recentTitleContainer}>
        <Text style={styles.recentTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate("All")}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.transactionList}>
        {filter.slice(0, 3).map((info) => (
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

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#2C6BED",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    height: 70,
  },
  avatar: {
    marginRight: 10,
  },
  greetingText: {
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
  balanceAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C6BED",
  },
  incomeExpenseContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
  },
  incomeExpenseCard: {
    flex: 1,
    margin: 10,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  incomeExpenseText: {
    color: "#FFF",
    fontSize: 18,
    marginTop: 10,
  },
  incomeExpenseAmount: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },
  recentTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    color: "#2C6BED",
    fontWeight: "bold",
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
