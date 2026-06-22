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
import { getCurrentUser, logoutUser, User } from "../data/localDb";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  const [showEnrolled, setShowEnrolled] = useState(false);
  const [showPurchased, setShowPurchased] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function loadUser() {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }

      loadUser();
    }, []),
  );

  async function handleLogout() {
    await logoutUser();
    router.replace("/");
  }

  const enrolledCourses = courses.filter((course) =>
    user?.enrolledCourses.includes(course.id),
  );

  const purchasedCourses = courses.filter((course) =>
    user?.purchasedCourses.includes(course.id),
  );

  const certificateCourses = courses.filter((course) =>
    user?.certificates?.includes(course.id),
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || "S"}
          </Text>
        </View>

        <Text style={styles.name}>{user?.name || "Student"}</Text>
        <Text style={styles.email}>{user?.email || "student@email.com"}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{enrolledCourses.length}</Text>
          <Text style={styles.statLabel}>Enrolled</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{purchasedCourses.length}</Text>
          <Text style={styles.statLabel}>Purchased</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{certificateCourses.length}</Text>
          <Text style={styles.statLabel}>Certificates</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Learning Summary</Text>

      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setShowEnrolled(!showEnrolled)}
      >
        <Text style={styles.dropdownTitle}>Enrolled Courses</Text>
        <Text style={styles.dropdownArrow}>{showEnrolled ? "⌃" : "⌄"}</Text>
      </TouchableOpacity>

      {showEnrolled && (
        <View style={styles.dropdownBody}>
          {enrolledCourses.length === 0 ? (
            <Text style={styles.emptyText}>No enrolled courses yet</Text>
          ) : (
            enrolledCourses.map((course) => {
              const completedLessons =
                user?.completedLessons?.[course.id]?.length || 0;

              const totalLessons = course.modules?.length || 0;

              return (
                <TouchableOpacity
                  key={course.id}
                  style={styles.courseRow}
                  onPress={() => router.push(`/course/${course.id}` as any)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.courseMeta}>
                      {completedLessons}/{totalLessons} completed
                    </Text>
                  </View>

                  <Text style={styles.viewText}>View</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setShowPurchased(!showPurchased)}
      >
        <Text style={styles.dropdownTitle}>Purchased Courses</Text>
        <Text style={styles.dropdownArrow}>{showPurchased ? "⌃" : "⌄"}</Text>
      </TouchableOpacity>

      {showPurchased && (
        <View style={styles.dropdownBody}>
          {purchasedCourses.length === 0 ? (
            <Text style={styles.emptyText}>No purchased courses yet</Text>
          ) : (
            purchasedCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseRow}
                onPress={() => router.push(`/course/${course.id}` as any)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseMeta}>₹{course.price}</Text>
                </View>

                <Text style={styles.viewText}>View</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setShowCertificates(!showCertificates)}
      >
        <Text style={styles.dropdownTitle}>Certificates</Text>
        <Text style={styles.dropdownArrow}>{showCertificates ? "⌃" : "⌄"}</Text>
      </TouchableOpacity>

      {showCertificates && (
        <View style={styles.dropdownBody}>
          {certificateCourses.length === 0 ? (
            <Text style={styles.emptyText}>No certificates yet</Text>
          ) : (
            certificateCourses.map((course) => (
              <View key={course.id} style={styles.courseRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseMeta}>Certificate completed</Text>
                </View>

                <Text style={styles.certificateBadge}>Issued</Text>
              </View>
            ))
          )}
        </View>
      )}

      <Text style={styles.sectionTitle}>Account</Text>

      <View style={styles.accountCard}>
        <View style={styles.accountRow}>
          <Text style={styles.accountLabel}>Full Name</Text>
          <Text style={styles.accountValue}>{user?.name || "-"}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.accountRow}>
          <Text style={styles.accountLabel}>Email</Text>
          <Text style={styles.accountValue}>{user?.email || "-"}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.homeButtonText}>Explore Courses</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 18,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  headerCard: {
    marginTop: 62,
    backgroundColor: "#052e16",
    borderRadius: 26,
    padding: 26,
    alignItems: "center",
    overflow: "hidden",
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#166534",
    fontSize: 34,
    fontWeight: "900",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    marginTop: 14,
  },

  email: {
    color: "#86efac",
    marginTop: 5,
    fontWeight: "600",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5F0E8",
  },

  statNumber: {
    fontSize: 23,
    fontWeight: "900",
    color: "#166534",
  },

  statLabel: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 19,
    fontWeight: "900",
    color: "#0D2818",
  },

  dropdownHeader: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5F0E8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0D2818",
  },

  dropdownArrow: {
    fontSize: 20,
    fontWeight: "900",
    color: "#166534",
  },

  dropdownBody: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 18,
    marginTop: -3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5F0E8",
  },

  emptyText: {
    color: "#6B7280",
    fontWeight: "700",
    padding: 6,
  },

  courseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0FDF4",
  },

  courseTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0D2818",
  },

  courseMeta: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },

  viewText: {
    color: "#166534",
    fontWeight: "900",
    marginLeft: 10,
  },

  certificateBadge: {
    color: "#166534",
    fontWeight: "900",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
  },

  accountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5F0E8",
    overflow: "hidden",
  },

  accountRow: {
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  accountLabel: {
    color: "#0D2818",
    fontWeight: "900",
  },

  accountValue: {
    color: "#6B7280",
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: "#F0FDF4",
  },

  homeButton: {
    backgroundColor: "#0D2818",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 28,
  },

  homeButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },

  logoutButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  logoutText: {
    color: "#DC2626",
    fontWeight: "900",
    fontSize: 15,
  },
});
