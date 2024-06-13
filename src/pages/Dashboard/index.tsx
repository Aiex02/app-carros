import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Container } from "./styles";
import { InputAmount } from "../../components/InputAmount";
import { spendingCreate } from "../../spending/spendingCreate";
import { spendingGetAll } from "../../spending/spendingGetAll";
import { formatAmount } from "../../utils/formatAmount";

export function Dashboard() {
  //limpa o AsyncStorage no ios
  //AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove)
  //alert('O programa sera finalizado')
  //return

  // limpa o AsyncStorage no android
  // await AsyncStorage.clear()
  // alert('O programa sera finalizado')
  // return

  const [monthYear, setMonthYear] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [client, setClient] = useState("");


  const validProducts = ["30-320", "20-280", "40-280", "50-310"];
  const validClients = ["VOLKSWAGEN", "NISSAN", "HYUNDAI", "PEUGEOT"];

  async function handleAddNewSpending() {
    if (
      !monthYear ||
      !product ||
      !quantity ||
      !amount ||
      !client 
    ) {
      return Alert.alert("Atenção", "Favor preencha todos os campos !!!");
    }

    if (!validProducts.includes(product)) {
      return Alert.alert(
        "Atenção",
        "Produto inválido! Aceita somente: 30-320, 20-280, 40-280, 50-310"
      );
    }

    const upperCaseClient = client.toUpperCase();
    if (!validClients.includes(upperCaseClient)) {
      return Alert.alert(
        "Atenção",
        "Cliente inválido! Aceita somente: Volkswagen, Nissan, Hyundai, Peugeot"
      );
    }

    const formattedAmount = formatAmount(amount);

    const data = {
      id: Date.now().toString(),
      monthYear,
      product,
      quantity: Number(quantity),
      amount: formattedAmount,
      client: upperCaseClient,
    };

    setMonthYear("");
    setProduct("");
    setQuantity("");
    setAmount("");
    setClient("");


    await spendingCreate(data);
    const result = await spendingGetAll();
    console.log(result);
  }

  const handleMonthYearChange = (value: any) => {
    let formattedValue = value.replace(/\D/g, "");

    if (formattedValue.length > 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
    }

    setMonthYear(formattedValue);
  };

  return (
    <Container>
      <Header title="Cadastro de Produtos" />

      <ScrollView>
        <Input
          placeholder="Mês e Ano (MM/YYYY)"
          placeholderTextColor="#363F5F"
          value={monthYear}
          onChangeText={handleMonthYearChange}
          keyboardType="numeric"
        />

        <Input
          placeholder="Produto (ex: 30-320)"
          placeholderTextColor="#363F5F"
          value={product}
          onChangeText={(value) => setProduct(value)}
        />

        <Input
          placeholder="Quantidade"
          placeholderTextColor="#363F5F"
          value={quantity}
          onChangeText={(value) => setQuantity(value)}
        />

        <InputAmount
          placeholder="Valor Unitário"
          placeholderTextColor="#363F5F"
          value={amount}
          onChangeText={(value) => setAmount(value)}
        />

        <Input
          placeholder="Cliente"
          placeholderTextColor="#363F5F"
          value={client}
          onChangeText={(value) => setClient(value)}
        />

      </ScrollView>

      <Button title="Adicionar" onPress={handleAddNewSpending} />
    </Container>
  );
}
