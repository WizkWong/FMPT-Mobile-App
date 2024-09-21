import { Link } from "expo-router";
import { View, Text } from "react-native";

const ReportPage = () => {
  return (
    <View>
      <Text>Report</Text>
      <Link push href="/manager/report">Link</Link>
    </View>
  );
};

export default ReportPage;