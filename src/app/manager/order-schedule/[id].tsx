import {
  addOrientationChangeListener,
  lockAsync,
  Orientation,
  OrientationLock,
} from "expo-screen-orientation";
import { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import globalStyles from "../../../constants/globalStyles";
import OrderSchedule from "../../../components/order/OrderSchedule";

const OrderSchedulePage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const parent = navigation.getParent();

  useEffect(() => {
    lockAsync(OrientationLock.DEFAULT);
    addOrientationChangeListener((event) => {
      const orientation = event.orientationInfo.orientation;

      if (
        orientation === Orientation.LANDSCAPE_LEFT ||
        orientation === Orientation.LANDSCAPE_RIGHT
      ) {
        parent.setOptions({
          tabBarStyle: [globalStyles.tabBar, { display: "none" }],
        });
      } else {
        parent.setOptions({
          tabBarStyle: [globalStyles.tabBar, { display: "flex" }],
        });
      }
    });
  }, []);
  return (
    <OrderSchedule orderId={+id} />
  );
};

export default OrderSchedulePage;
