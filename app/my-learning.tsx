import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { courses } from "../data/courses";
import { getCurrentUser, User } from "../data/localDb";

export default function MyLearning() {
  const [user, setUser] = useState<User | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function loadUser() {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }

      loadUser();
    }, []),
  );

  const enrolledCourses = courses.filter((course) =>
    user?.enrolledCourses.includes(course.id),
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>My Learning</Text>
      <Text style={styles.subtitle}>Continue your nutrition courses</Text>

      {enrolledCourses.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No courses yet</Text>
          <Text style={styles.emptyText}>
            Enroll in a free course or purchase a premium one.
          </Text>
        </View>
      ) : (
        enrolledCourses.map((course) => {
          const completedCount =
            user?.completedLessons?.[course.id]?.length || 0;

          const totalLessons = course.modules?.length || 0;

          const progressPercent =
            totalLessons > 0
              ? Math.round((completedCount / totalLessons) * 100)
              : 0;

          const isCompleted =
            totalLessons > 0 && completedCount === totalLessons;

          return (
            <TouchableOpacity
              key={course.id}
              style={styles.card}
              onPress={() => router.push(`/course/${course.id}` as any)}
            >
              <View style={styles.cardTopRow}>
                <Text style={styles.courseTitle}>{course.title}</Text>

                <Text
                  style={
                    isCompleted ? styles.completedBadge : styles.progressBadge
                  }
                >
                  {isCompleted ? "Completed" : "In Progress"}
                </Text>
              </View>

              <Text style={styles.meta}>
                {course.category} • {totalLessons} modules
              </Text>

              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>

              <Text style={styles.progressText}>
                {completedCount}/{totalLessons} modules completed •{" "}
                {progressPercent}%
              </Text>
            </TouchableOpacity>
          );
        })
      )}

      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.buttonText}>Explore Courses</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 20,
  },

  scrollContent: {
    paddingBottom: 140,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0D2818",
    marginTop: 55,
  },

  subtitle: {
    color: "#64748B",
    marginTop: 6,
    marginBottom: 20,
    fontWeight: "600",
  },

  emptyBox: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5F0E8",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0D2818",
  },

  emptyText: {
    color: "#64748B",
    marginTop: 8,
    lineHeight: 22,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5F0E8",
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  courseTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: "900",
    color: "#0D2818",
    lineHeight: 25,
  },

  progressBadge: {
    backgroundColor: "#FFF7ED",
    color: "#C2410C",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "900",
  },

  completedBadge: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "900",
  },

  meta: {
    color: "#64748B",
    marginTop: 7,
    fontWeight: "600",
  },

  progressBg: {
    height: 10,
    backgroundColor: "#DCFCE7",
    borderRadius: 20,
    marginTop: 15,
    overflow: "hidden",
  },

  progressFill: {
    height: 10,
    backgroundColor: "#166534",
    borderRadius: 20,
  },

  progressText: {
    marginTop: 8,
    color: "#475569",
    fontWeight: "700",
    fontSize: 13,
  },

  button: {
    backgroundColor: "#166534",
    padding: 16,
    borderRadius: 18,
    marginTop: 16,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 15,
  },
});
