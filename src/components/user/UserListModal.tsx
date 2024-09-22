import { View, Modal } from "react-native";
import useUtilityQuery from "../../hooks/useUtilityQuery";
import useSearchBar from "../../hooks/useSearchBar";
import CustomHeader from "../CustomHeader";
import UserList from "./UserList";
import { User } from "../../types/user";
import { UserRole } from "../../types/enum";

const UserListModal = ({
  visible,
  onModalClose,
  componentOnPress,
  filterByDepartment = "",
  filterByRole,
}: {
  visible: boolean;
  onModalClose: () => void;
  componentOnPress?: (user: User) => void;
  filterByDepartment?: string;
  filterByRole?: UserRole;
}) => {
  const utilityQuery = useUtilityQuery();
  const refresh = () =>
    utilityQuery.resetInfiniteQueryPagination(["fetchUserList"]);
  const [searchText, setSearchText] = useSearchBar(refresh);

  return (
    <Modal
      visible={visible}
      onRequestClose={onModalClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        <CustomHeader
          title="Assign an Employee"
          onPressBack={onModalClose}
          searchBarEnabled={true}
          searchText={searchText}
          onChangeSearchText={(text) => setSearchText(text)}
        />
        <View className="mb-10">
          <UserList
            searchText={searchText}
            componentOnPress={componentOnPress}
            refresh={refresh}
            filterByDepartment={filterByDepartment}
            filterByRole={filterByRole}
          />
        </View>
      </View>
    </Modal>
  );
};

export default UserListModal;
