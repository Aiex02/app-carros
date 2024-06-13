import { SpendingStorageDTO } from "../../spending/SpendingStorageDTO";
import {
  Container,
  Description,
  Amount,
  Local,
  Footer,
  Category,
  Date,
} from "./styles";

type Props = {
  data: SpendingStorageDTO;
}


export function TransactionExpenses({ data }: Props) {
  const total = data.quantity * data.amount
  return (
    <Container>
      <Description>{data.product}</Description>
      <Amount>{data.quantity} x R${data.amount}</Amount>
      <Local>Cliente: {data.client}</Local>

      <Footer>
        <Category>Mês/Ano: {data.monthYear}</Category>
      </Footer>
    </Container>
  );
}
