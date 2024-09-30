import { View, Text, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card } from "react-native-paper";
import CircularProgress from "react-native-circular-progress-indicator";
import { getDashboard } from "../../services/AnalyticService";
import { convertToDateString } from "../../utils/utility";
import CustomError from "../CustomError";
import Loading from "../Loading";

const Dashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetchDashboard"],
    queryFn: () => getDashboard(),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log(error);
    return <CustomError errorMsg={error.message} />;
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 mx-4 my-2 space-y-3">
        <View>
          <Text className="ml-1 text-lg font-semibold text-gray-800 mb-2">
            Order Completion
          </Text>
          <Card>
            <Card.Content>
              {data?.data.orderCompletionList.map((order, index) => (
                <View
                  key={index}
                  className="flex flex-row py-2 items-center space-x-3"
                >
                  <View className="basis-[142px]">
                    <Text>
                      <Text className="text-xs text-gray-500 font-bold">
                        Order ID:{" "}
                      </Text>
                      <Text className="text-xs">{order.orderId}</Text>
                    </Text>
                    <Text className="text-xs text-gray-700 font-medium">
                      <Text className="text-xs">{order.productName}</Text>
                    </Text>
                    <Text>
                      <Text className="text-xs text-gray-500 font-bold">
                        Quantity:{" "}
                      </Text>
                      <Text className="text-xs">{order.quantity}</Text>
                    </Text>
                  </View>
                  <View>
                    <CircularProgress
                      value={order.percentage}
                      maxValue={100}
                      radius={25}
                      valueSuffix={"%"}
                      progressValueColor={"#374151"}
                      activeStrokeColor={"#3b82f6"}
                      inActiveStrokeColor={"#d1d5db"}
                      progressValueStyle={{ fontWeight: "bold", fontSize: 11 }}
                    />
                  </View>
                  <View>
                    <Text className="text-xs text-gray-500 font-bold">Deadline:</Text>
                    <Text className="text-xs">{convertToDateString(order.deadlineDate)}</Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>
        <View>
          <Text className="ml-1 text-lg font-semibold text-gray-800 mb-2">
            Total Active Task
          </Text>
          <Card>
            <Card.Content>
              <View className="flex flex-row">
                <Text className="basis-2/5 text-sm font-semibold text-blue-500">
                  In Progress:{" "}
                </Text>
                <Text className="text-sm font-semibold text-gray-600">
                  {data?.data.totalActiveTask.inProgress}
                </Text>
              </View>
              <View className="flex flex-row">
                <Text className="basis-2/5 text-sm font-semibold text-gray-700">
                  Not Started:
                </Text>
                <Text className="text-sm font-semibold text-gray-600">
                  {data?.data.totalActiveTask.notStarted}
                </Text>
              </View>
              <View className="flex flex-row">
                <Text className="basis-2/5 text-sm font-semibold text-yellow-600">
                  Pending:{" "}
                </Text>
                <Text className="text-sm font-semibold text-gray-600">
                  {data?.data.totalActiveTask.pending}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>
        <View>
          <Text className="ml-1 text-lg font-semibold text-gray-800 mb-2">
            Department Yearly Score
          </Text>
          {data?.data.departmentScoreList.map((department, index) => (
            <Card key={index} className="my-1">
              <Card.Content>
                <View className="flex flex-row py-2 text-sm space-x-1">
                  <Text className="text-xs basis-32 font-semibold text-gray-800">
                    {department.department}
                  </Text>
                  <Text className="text-xs basis-20">
                    <Text className="font-semibold text-gray-800">
                      Mean:{" "}
                    </Text>
                    <Text>{department.meanScore}</Text>
                  </Text>
                  <Text className="text-xs basis-20">
                    <Text className="font-semibold text-gray-800">
                      Median:{" "}
                    </Text>
                    <Text>{department.medianScore}</Text>
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
