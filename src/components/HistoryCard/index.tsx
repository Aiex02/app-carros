import {
  Container,
  Title,
  Amount
} from './styles'

interface Props {
  name: string;
  total: number;
}

export function HistoryCard({
  name,
  total,
}: Props) {
  return (
    <Container>
      <Title>{name}</Title>
      <Amount>{total}</Amount>
    </Container>
  )
}