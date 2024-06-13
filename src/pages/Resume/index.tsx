import React, { useState } from "react";
import { Alert, FlatList } from "react-native";
import { spendingGetAll } from "../../spending/spendingGetAll";
import {
  Container,
  Content,
  Header,
  Title,
  Input,
  Button,
  ButtonText,
  ClientTotalContainer,
  ClientTotalText,
} from "./style";
import { SpendingStorageDTO } from "../../spending/SpendingStorageDTO";

// Função para aplicar a máscara de data (MM/YYYY)
const applyDateMask = (value: string): string => {
  let formattedValue = value.replace(/\D/g, '');

  if (formattedValue.length > 2) {
    formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
  }

  if (formattedValue.length > 7) {
    formattedValue = formattedValue.slice(0, 7); 
  }

  return formattedValue;
};

type ClientTotal = {
  client: string;
  total: number;
};

export function Resume() {
  const [monthYear, setMonthYear] = useState<string>('');
  const [clientTotals, setClientTotals] = useState<ClientTotal[]>([]);

  async function loadData() {
    if (!monthYear) {
      return Alert.alert("Atenção", "Favor preencher o mês e ano!");
    }

    const data: SpendingStorageDTO[] = await spendingGetAll();
    
    const filteredData = data.filter(item => item.monthYear === monthYear);

    const clientTotalMap = filteredData.reduce<{ [key: string]: number }>((acc, item) => {
      const client = item.client.toUpperCase();
      const total = item.amount * item.quantity;
      
      if (acc[client]) {
        acc[client] += total;
      } else {
        acc[client] = total;
      }

      return acc;
    }, {});

    const clientTotalArray = Object.keys(clientTotalMap).map(client => ({
      client,
      total: clientTotalMap[client]
    }));

    setClientTotals(clientTotalArray);
  }

  const handleMonthYearChange = (value: string) => {
    const maskedValue = applyDateMask(value);
    setMonthYear(maskedValue);
  };

  return (
    <Container>
      <Header>
        <Title>Resumo Mensal</Title>
      </Header>

      <Content contentContainerStyle={{ padding: 24 }}>
        <Input
          placeholder="Mês e Ano (MM/YYYY)"
          value={monthYear}
          onChangeText={handleMonthYearChange}
          keyboardType="numeric"
        />
        <Button onPress={loadData}>
          <ButtonText>Pesquisar</ButtonText>
        </Button>

        <FlatList
          data={clientTotals}
          keyExtractor={(item) => item.client}
          renderItem={({ item }) => (
            <ClientTotalContainer>
              <ClientTotalText>{item.client}: R$ {item.total.toFixed(2)}</ClientTotalText>
            </ClientTotalContainer>
          )}
        />
      </Content>
    </Container>
  );
}
