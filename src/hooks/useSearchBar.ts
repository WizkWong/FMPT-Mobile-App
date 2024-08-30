import { useEffect, useState } from "react";

const useSearchBar = (refreshData : () => void) => {
  const [searchText, setSearchText] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout>(null);

  useEffect(() => {
    if (timer !== null) {
      clearTimeout(timer);
      setTimer(null);
    }
    const timerId = setTimeout(() => {
      refreshData();
      setTimer(null);
    }, 500);
    setTimer(timerId);
  }, [searchText])

  return [searchText, setSearchText] as const;
};

export default useSearchBar;
