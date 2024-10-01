import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useMemo, useState } from "react";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Avatar, DataTable } from "react-native-paper";
import { LineChart } from "react-native-gifted-charts";
import globalStyles from "../../constants/globalStyles";
import { getEmployeeProductionRecord } from "../../services/AnalyticService";
import { getUserById } from "../../services/UserService";
import { EmployeeProductionRecord } from "../../types/analytic";
import { Part } from "../../types/productPart";
import { capitalizedCase } from "../../utils/utility";
import CustomError from "../CustomError";
import Loading from "../Loading";

interface PartStatistic {
  part: Part;
  highest: number;
  lowest: number;
  mean: number;
  median: number;
}

const calculateTimePerQuantityStats = (
  records: EmployeeProductionRecord[] = []
): PartStatistic[] => {
  // Helper function to calculate the time difference in hours
  const getTimeDifferenceInHours = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const differenceInMs = endDate.getTime() - startDate.getTime();
    return differenceInMs / (1000 * 60 * 60); // convert ms to hours
  };

  // Process each record
  return records.map((record) => {
    const partsPerHourList: number[] = [];

    // Calculate parts per hour for each ProductionTaskScore
    record.productionTaskScoreList.forEach((score) => {
      const timeInHours = getTimeDifferenceInHours(
        score.startDateTime,
        score.completeDateTime
      );
      const partsPerHour = score.quantity / timeInHours;
      partsPerHourList.push(partsPerHour);
    });

    if (partsPerHourList.length === 0) {
      return {
        part: record.part,
        highest: null,
        lowest: null,
        mean: null,
        median: null,
      };
    }

    // Sort the array for median calculation
    const sortedPartsPerHour = [...partsPerHourList].sort((a, b) => a - b);

    // Calculate statistics
    const highest = Math.max(...partsPerHourList);
    const lowest = Math.min(...partsPerHourList);
    const mean =
      partsPerHourList.reduce((sum, value) => sum + value, 0) /
      partsPerHourList.length;
    const median =
      sortedPartsPerHour.length % 2 === 0
        ? (sortedPartsPerHour[sortedPartsPerHour.length / 2 - 1] +
            sortedPartsPerHour[sortedPartsPerHour.length / 2]) /
          2
        : sortedPartsPerHour[Math.floor(sortedPartsPerHour.length / 2)];

    // Return the part and rounded statistics
    return {
      part: record.part,
      highest: Math.round(highest * 100) / 100,
      lowest: Math.round(lowest * 100) / 100,
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
    };
  });
};

interface DataPoint {
  value: number;
  dataPointText: string;
}

function getRecentProductionScores(
  records: EmployeeProductionRecord[] = []
): DataPoint[] {
  // Flatten all production task scores into one array, each with part information
  const allScores = records.flatMap((record) =>
    record.productionTaskScoreList.map((score) => ({
      partName: record.part.name,
      score: score.score,
      completeDateTime: score.completeDateTime,
    }))
  );

  // Sort all scores by completeDateTime in ascending order
  allScores.sort(
    (a, b) =>
      new Date(a.completeDateTime).getTime() -
      new Date(b.completeDateTime).getTime()
  );

  // Take the last 10 elements (if there are less than 10, take all)
  const recentScores = allScores.slice(Math.max(allScores.length - 10, 0));

  // Map to the final result format { value, dataPointText }
  return recentScores.map((score) => ({
    value: score.score,
    dataPointText: `${score.score}`,
  }));
}

const EmployeeStatistic = ({ employeeId } : { employeeId: number }) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  const {
    data: employee,
    isLoading: isEmployeeLoading,
    isError: isEmployeeError,
    error: employeeError,
  } = useQuery({
    queryKey: ["fetchUser", employeeId],
    queryFn: () => getUserById(employeeId),
    refetchOnWindowFocus: "always",
  });

  const {
    data: employeeRecord,
    isLoading: isEmployeeRecordLoading,
    isError: isEmployeeRecordError,
    error: employeeRecordError,
  } = useQuery({
    queryKey: ["fetchEmployeeProductionRecord", employeeId],
    queryFn: () => getEmployeeProductionRecord(employeeId),
    refetchOnWindowFocus: "always",
  });

  const recordStats = useMemo(
    () => calculateTimePerQuantityStats(employeeRecord?.data),
    [employeeRecord?.data]
  );

  const lineData = useMemo(
    () => getRecentProductionScores(employeeRecord?.data),
    [employeeRecord?.data]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, recordStats.length);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex flex-row items-center p-4 bg-white">
        <Pressable onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={20} color="#374151" />
        </Pressable>
        <Text className="text-base text-gray-700 font-semibold ml-5">
          Employee
        </Text>
      </View>
      <View className="mx-4 my-2 space-y-4">
        {isEmployeeLoading ? (
          <Loading />
        ) : isEmployeeError ? (
          <CustomError errorMsg={employeeError.message} />
        ) : (
          <View
            className="flex flex-row p-3 bg-white items-center justify-start"
            style={[globalStyles.lightShadow, { borderRadius: 12 }]}
          >
            {employee?.data.image ? (
              <Avatar.Image
                size={60}
                style={{
                  marginRight: 12,
                }}
                source={{ uri: `data:image/jpg;base64,${employee.data.image}` }}
              />
            ) : (
              <Avatar.Icon
                className="bg-amber-500"
                size={60}
                color="white"
                icon="account"
                style={{
                  marginRight: 12,
                }}
              />
            )}
            <View className="mr-auto">
              <Text className="text-base font-semibold text-[#292929]">
                {employee?.data.username}
              </Text>
              <Text className="mt-0.5 text-sm font-norma text-[#858585]">
                {employee?.data.department}
              </Text>
              <Text className="mt-0.5 text-sm font-normal text-[#858585]">
                {capitalizedCase(employee?.data.role ?? "")}
              </Text>
            </View>
          </View>
        )}
        {isEmployeeRecordLoading ? (
          <Loading />
        ) : isEmployeeRecordError ? (
          <CustomError errorMsg={employeeRecordError.message} />
        ) : (
          <View>
            <Text className="ml-1 text-base font-semibold text-gray-800 mb-4">
              Recent Task Scores
            </Text>
            <LineChart
              initialSpacing={0}
              data={lineData}
              spacing={30}
              textColor1="#4b5563"
              textShiftY={-8}
              textShiftX={8}
              textFontSize={12}
              thickness={1}
              maxValue={100}
              width={250}
              xAxisColor="#4b5563"
              yAxisColor="#4b5563"
              yAxisTextStyle={{ color: "#4b5563", fontSize: 10 }}
              dataPointsColor="#4b5563"
              color1="#6b7280"
            />
            <Text className="ml-1 text-base font-semibold text-gray-800 mb-1">
              Parts Production Table
            </Text>
            <Text className="ml-1 text-xs font-medium text-gray-800 mb-2">
              Data Unit: pieces/hour
            </Text>
            <DataTable
              style={[
                globalStyles.lightShadow,
                { backgroundColor: "white", borderRadius: 12 },
              ]}
            >
              <DataTable.Header>
                <DataTable.Title
                  style={{ flex: 2 }}
                  textStyle={styles.cellText}
                >
                  Part
                </DataTable.Title>
                <DataTable.Title textStyle={styles.cellText} numeric>
                  Lowest
                </DataTable.Title>
                <DataTable.Title textStyle={styles.cellText} numeric>
                  Highest
                </DataTable.Title>
                <DataTable.Title textStyle={styles.cellText} numeric>
                  Mean
                </DataTable.Title>
                <DataTable.Title textStyle={styles.cellText} numeric>
                  Median
                </DataTable.Title>
              </DataTable.Header>

              {recordStats?.slice(from, to)?.map((item, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell
                    style={{ flex: 2 }}
                    textStyle={styles.cellText}
                  >
                    <Text className="text-[10px]">{item.part.name}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText} numeric>
                    {item.lowest}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText} numeric>
                    {item.highest}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText} numeric>
                    {item.mean}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText} numeric>
                    {item.median}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(recordStats.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${recordStats.length}`}
                numberOfItemsPerPage={itemsPerPage}
                showFastPaginationControls
                selectPageDropdownLabel={"Rows per page"}
              />
            </DataTable>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cellText: {
    fontSize: 10,
  },
});

export default EmployeeStatistic;
