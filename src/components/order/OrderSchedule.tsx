import { Modal, ScrollView, View } from "react-native";
import {
  CalendarBody,
  CalendarContainer,
  CalendarHeader,
  CalendarKitHandle,
  LocaleConfigsProps,
} from "@howljs/calendar-kit";
import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Portal } from "react-native-paper";
import { getTaskScheduleByOrderId } from "../../services/TaskService";
import { Status } from "../../types/enum";
import { TaskSchedule } from "../../types/task";
import CustomError from "../CustomError";
import CustomHeader from "../CustomHeader";
import Loading from "../Loading";
import TaskDetailScheduleView from "../task/TaskDetailScheduleView";
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { useNavigation } from "expo-router";

const MIN_DATE = new Date(
  new Date().getFullYear(),
  new Date().getMonth() - 1,
  new Date().getDate()
).toISOString();

const MAX_DATE = new Date(
  new Date().getFullYear() + 1,
  new Date().getMonth(),
  new Date().getDate()
).toISOString();

const initialLocales: Record<string, Partial<LocaleConfigsProps>> = {
  en: {
    weekDayShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
    meridiem: { ante: "am", post: "pm" },
  },
  ja: {
    weekDayShort: "日_月_火_水_木_金_土".split("_"),
    meridiem: { ante: "午前", post: "午後" },
  },
  vi: {
    weekDayShort: "CN_T2_T3_T4_T5_T6_T7".split("_"),
    meridiem: { ante: "sa", post: "ch" },
  },
};

const randomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const OrderSchedule = ({ orderId }: { orderId: number }) => {
  const calendarRef = useRef<CalendarKitHandle>(null);
  const taskIdColorRef = useRef<{ [key: number]: string }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number>();
  const navigation = useNavigation();

  const highlightDates = useMemo(
    () => ({
      "6": { dayNumber: { color: "blue" }, dayName: { color: "blue" } },
      "7": { dayNumber: { color: "red" }, dayName: { color: "red" } },
    }),
    []
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetchTaskSchedule", orderId],
    queryFn: () => getTaskScheduleByOrderId(orderId),
    refetchInterval: 30000,
  });

  // round to the next 30-minute mark
  const roundToNext30Minutes = (date: Date): Date => {
    const minutes = date.getMinutes();
    const addMinutes = minutes <= 29 ? 30 - minutes : 60 - minutes;
    return new Date(date.getTime() + addMinutes * 60000);
  };

  const taskSchedules = useMemo(() => {
    const fillTaskTimes = (taskSchedules: TaskSchedule[]): TaskSchedule[] => {
      let previousCompleteDateTime: Date | null = null;

      return taskSchedules.map((task) => {
        let startDateTime = task.startDateTime
          ? new Date(task.startDateTime)
          : null;
        let completeDateTime = task.completeDateTime
          ? new Date(task.completeDateTime)
          : null;

        // If startDateTime is null, set it based on previousCompleteDateTime (or current time if it's the first step)
        if (!startDateTime && previousCompleteDateTime) {
          startDateTime = roundToNext30Minutes(previousCompleteDateTime); // Start at the next 30-minute mark
        } else if (!startDateTime) {
          startDateTime = new Date(); // Default to current time if no previous task
        }

        // If completeDateTime is null, set it 30 minutes after startDateTime
        if (!completeDateTime && startDateTime) {
          completeDateTime = new Date(startDateTime.getTime() + 30 * 60000);
        }

        // Update previousCompleteDateTime for the next iteration
        previousCompleteDateTime = completeDateTime;

        return {
          ...task,
          startDateTime: startDateTime?.toISOString() ?? null,
          completeDateTime: completeDateTime?.toISOString() ?? null,
        };
      });
    };

    return fillTaskTimes(data?.data ?? []);
  }, [data?.data]);

  const eventItems = useMemo(() => {
    return taskSchedules.map((taskSchedule) => {
      if (!taskIdColorRef.current[taskSchedule.partId]) {
        taskIdColorRef.current[taskSchedule.partId] = randomColor(); // Assign a new color if not already assigned
      }
      return {
        id: taskSchedule.id.toString(),
        start: {
          dateTime: new Date(taskSchedule.startDateTime).toISOString(),
        },
        end: {
          dateTime: new Date(taskSchedule.completeDateTime).toISOString(),
        },
        title: `Step: ${taskSchedule.stepNo}\n${
          taskSchedule.partName
        }\nDepartment: ${taskSchedule.department}\nStatus: ${Status.toString(
          taskSchedule.status
        )}`,
        color: taskIdColorRef.current[taskSchedule.partId],
      };
    });
  }, [taskSchedules]);

  const minMaxDates = useMemo(() => {
    return taskSchedules.reduce(
      (acc, current) => {
        const currentStartDateTime = new Date(current.startDateTime);
        const currentCompleteDateTime = new Date(current.completeDateTime);

        return {
          minStartDateTime:
            currentStartDateTime.getTime() < new Date(acc.minStartDateTime).getTime()
              ? currentStartDateTime.toISOString()
              : acc.minStartDateTime,
          maxCompleteDateTime:
            currentCompleteDateTime.getTime() > new Date(acc.maxCompleteDateTime).getTime()
              ? currentCompleteDateTime.toISOString()
              : acc.maxCompleteDateTime,
        };
      },
      {
        minStartDateTime:
          taskSchedules.length !== 0
            ? new Date(taskSchedules[0]?.startDateTime).toISOString()
            : MIN_DATE,
        maxCompleteDateTime:
          taskSchedules.length !== 0
            ? new Date(taskSchedules[0]?.completeDateTime).toISOString()
            : MAX_DATE,
      }
    );
  }, [taskSchedules]);

  const currentDate = useSharedValue(minMaxDates.minStartDateTime);

  const updateTitle = (date: string) => {
    const formatted = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    navigation.setOptions({ headerTitle: formatted });
  };

  useAnimatedReaction(
    () => currentDate.value,
    (value) => {
      runOnJS(updateTitle)(value);
    },
    []
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log(error);
    return <CustomError errorMsg={error.message} />;
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <CalendarContainer
        ref={calendarRef}
        theme={{
          textStyle: {
            color: "white",
            fontSize: 14,
            lineHeight: 17,
          },
        }}
        scrollByDay
        allowPinchToZoom
        numberOfDays={4}
        initialLocales={initialLocales}
        locale="en"
        minDate={minMaxDates.minStartDateTime}
        maxDate={minMaxDates.maxCompleteDateTime}
        initialDate={minMaxDates.minStartDateTime}
        highlightDates={highlightDates}
        events={eventItems}
        scrollToNow={false}
        initialTimeIntervalHeight={60}
        minTimeIntervalHeight={30}
        maxTimeIntervalHeight={200}
        timeZone="Asia/Kuala_Lumpur"
        allowDragToEdit={false}
        allowDragToCreate={false}
        minRegularEventMinutes={5}
        onPressEvent={(event) => {
          setSelectedTaskId(+event.id);
          setModalVisible(true);
        }}
        onChange={(date: string) => {
          currentDate.value = date;
        }}
      >
        <CalendarHeader />
        <CalendarBody />
      </CalendarContainer>
      <Portal>
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View className="flex-1 bg-white">
            <CustomHeader
              title="Task Detail"
              onPressBack={() => setModalVisible(false)}
            />
            <View className="flex-1">
              <TaskDetailScheduleView taskId={selectedTaskId} />
            </View>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

export default OrderSchedule;
