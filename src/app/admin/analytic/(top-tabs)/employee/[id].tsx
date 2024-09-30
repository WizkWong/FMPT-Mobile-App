import { useLocalSearchParams } from "expo-router";
import EmployeeStatistic from "../../../../../components/analytic/EmployeeStatistic";

const EmployeeStatisticPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <EmployeeStatistic employeeId={+id} />
  );
};

export default EmployeeStatisticPage;
