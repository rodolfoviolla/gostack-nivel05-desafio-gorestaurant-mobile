import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

export interface Food {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  formattedPrice: string;
  thumbnail_url: string;
  extras: Extra[];
}

const Orders: React.FC = () => {
  // const isFocused = useIsFocused();
  const [orders, setOrders] = useState<Food[]>([]);

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      // Load orders from API
      const { data } = await api.get<Food[]>('/orders');

      const newOrders = data.map(order => {
        const extrasTotal = order.extras.reduce(
          (acc, { quantity, value }) => acc + quantity * value,
          0,
        );
        const orderTotal = order.quantity * order.price;

        // Incui os adicionais em cada prato
        const total = orderTotal + extrasTotal * order.quantity;

        // Inclui adicionais uma vez em todo o pedido
        // const total = foodTotal + extraTotal;

        const formattedPrice = formatValue(total);

        return { ...order, formattedPrice };
      });

      setOrders(newOrders);
    }

    loadOrders();
    // }, [isFocused]);
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food key={item.id} activeOpacity={0.6}>
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Orders;
