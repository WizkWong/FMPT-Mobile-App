import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Custom hook to retrieve data from AsyncStorage and handle success or error.
 *
 * This hook automatically attempts to fetch a JSON value from AsyncStorage based on the provided key,
 * parses it, and calls the `onSuccess` callback with the parsed data if successful. If there's an error
 * (e.g., the data is empty or cannot be fetched), it will invoke the `onError` callback with the error.
 *
 * The retrieved data can be of any object type (`T`), which will be parsed using `JSON.parse`.
 *
 * Notes:
 * - The value retrieved from AsyncStorage must be a valid JSON string that can be parsed into an object.
 * - The hook must return an object of any type (`T`).
 * - The hook automatically removes the item from AsyncStorage after retrieval.
 *
 * @template T - The expected type of the parsed JSON data.
 *
 * @param {Object} params - The parameters for the hook.
 * @param {string} params.key - The key to retrieve data from AsyncStorage.
 * @param {(jsonValue: T) => void} params.onSuccess - The callback that runs when the data is successfully retrieved and parsed.
 * @param {(error: any) => void} params.onError - The callback that runs when there is an error in retrieval or parsing.
 *
 * @example
 * useAsyncStorageGet({
 *   key: 'my-key',
 *   onSuccess: (data) => {
 *     console.log("Retrieved data:", data);
 *   },
 *   onError: (error) => {
 *     console.error("Failed to retrieve data:", error);
 *   },
 * });
 */
const useAsyncStorageGet = <T>({
  key,
  onSuccess,
  onError = () => {},
}: {
  key: string;
  onSuccess: (jsonValue: T) => void;
  onError?: (error: any) => void;
}) => {
  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(key);
        if (!jsonValue) {
          throw Error("Data is empty");
        }
        onSuccess(JSON.parse(jsonValue));
      } catch (e) {
        onError(e);
      }
    };
    getData();
    return () => {
      AsyncStorage.removeItem(key);
    };
  }, []);
};

export default useAsyncStorageGet;
