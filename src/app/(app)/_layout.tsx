import { Stack } from "expo-router";
import { CoursesProvider } from "@/context/CoursesContext";

export default function AppLayout() {
  return (
    <CoursesProvider>
      <Stack>
        <Stack.Screen
          name="dashboard"
          options={{ title: "Courses", headerLargeTitle: true }}
        />
        <Stack.Screen name="course-details" options={{ title: "Course" }} />
      </Stack>
    </CoursesProvider>
  );
}
