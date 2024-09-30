import { lockAsync, OrientationLock } from "expo-screen-orientation";
import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import OrderSchedule from "../../../components/order/OrderSchedule";

const OrderSchedulePage = () => {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  useEffect(() => {
    lockAsync(OrientationLock.DEFAULT);
  }, []);
  return <OrderSchedule orderId={+orderId} />;
};

export default OrderSchedulePage;
