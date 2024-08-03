import { useQuery } from "@tanstack/react-query";
import { View, Text, FlatList } from "react-native";
import { getAllUsers } from "../../services/UserService";
import { Link } from "expo-router";
import { User } from "../../types/user";
import Loading from "../../components/Loading";
import CustomError from "../../components/CustomError";

const UserListPage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetchUserList"],
    queryFn: () => getAllUsers(),
    staleTime: Infinity,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log(error);
    return <CustomError errorMsg={error.message} />;
  }

  const renderItem = ({ item }: { item: User }) => {
    return (
      <Link
        className="py-4 border-2 rounded my-1 mx-4"
        push
        href={`/users/${item.id}`}
      >
        {item.username}
      </Link>
    );
  };

  return (
    <View className="flex flex-col justify-center mx-5 my-2">
      {data?.data.length === 0 ? (
        <Text className="text-lg font-medium">Empty Users</Text>
      ) : (
        <FlatList
          data={data.data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default UserListPage;
