import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { courses } from "../../../data/courses";
import {
  getCurrentUser,
  markLessonComplete,
  User,
} from "../../../data/localDb";

export default function LessonScreen() {
  const params = useLocalSearchParams();

  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId;

  const lessonId = Array.isArray(params.lessonId)
    ? params.lessonId[0]
    : params.lessonId;

  const foundCourse = courses.find((item) => item.id === courseId);

  const [user, setUser] = useState<User | null>(null);

  async function loadUser() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, []),
  );

  if (!foundCourse) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Course not found</Text>

        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const course = foundCourse;

  const foundLesson = course.modules.find((item) => item.id === lessonId);

  if (!foundLesson) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Lesson not found</Text>

        <TouchableOpacity
          style={styles.errorButton}
          onPress={() =>
            router.replace({
              pathname: "/course/[id]" as any,
              params: { id: course.id },
            })
          }
        >
          <Text style={styles.errorButtonText}>Back to Course</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const lesson = foundLesson;

  const completedLessons = user?.completedLessons?.[course.id] || [];
  const isCompleted = completedLessons.includes(lesson.id);

  const currentIndex = course.modules.findIndex(
    (item) => item.id === lesson.id,
  );

  const previousLesson =
    currentIndex > 0 ? course.modules[currentIndex - 1] : null;

  const isUnlocked =
    currentIndex === 0 ||
    !previousLesson ||
    completedLessons.includes(previousLesson.id);

  const nextLesson =
    currentIndex < course.modules.length - 1
      ? course.modules[currentIndex + 1]
      : null;

  const isFinalModule = !nextLesson;

  const finishButtonDisabled = isFinalModule && isCompleted;

  async function handleComplete() {
    if (!isUnlocked) {
      Alert.alert("Locked", "Please complete the previous module first.");
      return;
    }

    if (finishButtonDisabled) return;

    await markLessonComplete(course.id, lesson.id);
    await loadUser();

    if (nextLesson) {
      router.replace({
        pathname: "/lesson/[courseId]/[lessonId]" as any,
        params: {
          courseId: course.id,
          lessonId: nextLesson.id,
        },
      });

      return;
    }

    router.replace({
      pathname: "/course/[id]" as any,
      params: { id: course.id },
    });
  }

  const completeButtonText = nextLesson
    ? isCompleted
      ? "Continue to Next Module"
      : "Mark Complete & Continue"
    : isCompleted
      ? "Course Finished"
      : "Complete Final Module";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <Text style={styles.category}>{course.category}</Text>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.moduleCount}>
          Module {currentIndex + 1} of {course.modules.length}
        </Text>
      </View>

      <View style={styles.contentCard}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.readingTime}>{lesson.readingTime} reading</Text>

        {!isUnlocked ? (
          <View style={styles.lockedBox}>
            <Text style={styles.lockedTitle}>Module Locked</Text>
            <Text style={styles.lockedText}>
              Complete the previous module to unlock this lesson.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.contentText}>{lesson.content}</Text>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Learning Note</Text>
              <Text style={styles.summaryText}>
                After reading this module, press complete to unlock the next
                module.
              </Text>
            </View>
          </>
        )}
      </View>

      {isUnlocked && (
        <TouchableOpacity
          style={[
            styles.completeButton,
            isCompleted && styles.completedButton,
            finishButtonDisabled && styles.disabledButton,
          ]}
          onPress={handleComplete}
          disabled={finishButtonDisabled}
        >
          <Text
            style={[
              styles.completeButtonText,
              finishButtonDisabled && styles.disabledButtonText,
            ]}
          >
            {completeButtonText}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() =>
          router.replace({
            pathname: "/course/[id]" as any,
            params: { id: course.id },
          })
        }
      >
        <Text style={styles.back}>Back to Course</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 18,
  },
  center: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0D2818",
  },
  errorButton: {
    backgroundColor: "#166534",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 20,
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  headerCard: {
    marginTop: 58,
    backgroundColor: "#052e16",
    padding: 22,
    borderRadius: 24,
  },
  category: {
    color: "#86efac",
    fontWeight: "900",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  courseTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 8,
    lineHeight: 31,
  },
  moduleCount: {
    color: "#BBF7D0",
    marginTop: 10,
    fontWeight: "700",
  },
  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E5F0E8",
  },
  lessonTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0D2818",
    lineHeight: 33,
  },
  readingTime: {
    color: "#6B7280",
    marginTop: 6,
    fontWeight: "700",
  },
  contentText: {
    color: "#374151",
    fontSize: 16,
    lineHeight: 28,
    marginTop: 22,
    fontWeight: "500",
  },
  summaryBox: {
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 18,
    marginTop: 24,
  },
  summaryTitle: {
    color: "#166534",
    fontWeight: "900",
    fontSize: 16,
  },
  summaryText: {
    color: "#475569",
    marginTop: 6,
    lineHeight: 22,
    fontWeight: "600",
  },
  lockedBox: {
    backgroundColor: "#F3F4F6",
    padding: 18,
    borderRadius: 18,
    marginTop: 22,
  },
  lockedTitle: {
    color: "#374151",
    fontSize: 18,
    fontWeight: "900",
  },
  lockedText: {
    color: "#6B7280",
    marginTop: 8,
    lineHeight: 22,
    fontWeight: "600",
  },
  completeButton: {
    backgroundColor: "#166534",
    padding: 16,
    borderRadius: 18,
    marginTop: 22,
  },
  completedButton: {
    backgroundColor: "#0D2818",
  },
  disabledButton: {
    backgroundColor: "#D1D5DB",
  },
  completeButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 15,
  },
  disabledButtonText: {
    color: "#6B7280",
  },
  back: {
    color: "#166534",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "900",
  },
});
