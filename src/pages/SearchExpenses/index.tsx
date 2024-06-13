import { useState } from "react";
import { Alert, FlatList, Text } from "react-native";
import { Header } from "../../components/Header";
import { Container, Transactions, TextCard } from "./styles";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { spendingGetAll } from "../../spending/spendingGetAll";
import { SpendingStorageDTO } from "../../spending/SpendingStorageDTO";
import { SearchExpensesList } from "../../components/SearchExpensesList";

export function SearchExpenses() {
  const [product, setProduct] = useState("");
  const [client, setClient] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [categories, setCategories] = useState<SpendingStorageDTO[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  async function handleSearchSpending() {
    if (
      product.trim() === "" &&
      client.trim() === "" &&
      monthYear.trim() === ""
    ) {
      return Alert.alert(
        "Atenção",
        "Digite ao menos um critério para pesquisar"
      );
    }

    const data: SpendingStorageDTO[] = await spendingGetAll();

    const filteredData = data.filter((item) => {
      return (
        (product
          ? item.product.toUpperCase().includes(product.toUpperCase())
          : true) &&
        (client
          ? item.client.toUpperCase().includes(client.toUpperCase())
          : true) &&
        (monthYear ? item.monthYear === monthYear : true)
      );
    });

    // Debug: Verificar os dados filtrados
    console.log("Filtered Data:", filteredData);

    if (filteredData.length === 0) {
      setCategories([]);
      setTotalAmount(0);
      return Alert.alert("Atenção", "Nenhum registro encontrado!");
    }

    setCategories(filteredData);

    const total = filteredData.reduce(
      (sum, item) => sum + item.amount * item.quantity,
      0
    );
    setTotalAmount(total);
  }

  const handleMonthYearChange = (value: string) => {
    let formattedValue = value.replace(/\D/g, "");

    if (formattedValue.length > 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
    }

    setMonthYear(formattedValue);
  };

  return (
    <Container>
      <Header title="Pesquisa Gastos" />

      <Input
        placeholder="Produto"
        placeholderTextColor="#363F5F"
        onChangeText={(value) => setProduct(value)}
      />

      <Input
        placeholder="Cliente"
        placeholderTextColor="#363F5F"
        onChangeText={(value) => setClient(value)}
      />

      <Input
        placeholder="Mês e Ano (MM/YYYY)"
        placeholderTextColor="#363F5F"
        value={monthYear}
        onChangeText={handleMonthYearChange}
        keyboardType="numeric"
      />

      <Button title="Pesquisar" onPress={handleSearchSpending} />

      <Transactions>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id} 
          renderItem={({ item }) => <SearchExpensesList data={item} />}
        />
      </Transactions>
    </Container>
  );
}
