import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { courses } from "../data/courses";
import { getCurrentUser, User } from "../data/localDb";

export default function Home() {
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topBrandSection}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoLeaf}>N</Text>
          </View>

          <View>
            <Text style={styles.logoText}>NUTRIACADEMY</Text>
            <Text style={styles.logoTagline}>
              Professional Nutrition Learning Platform
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeLabel}>Welcome back</Text>
          <Text style={styles.welcomeName}>{user?.name || "Student"}</Text>
          <Text style={styles.welcomeSubtext}>
            Continue your learning journey
          </Text>
        </View>

        <View style={styles.statsMini}>
          <Text style={styles.statsNumber}>{courses.length}</Text>
          <Text style={styles.statsText}>Courses</Text>
        </View>
      </View>

      <Text style={styles.heading}>Explore Courses</Text>

      <View style={styles.banner}>
        <View style={styles.bannerAccent} />
        <Text style={styles.bannerTitle}>Become job-ready in nutrition</Text>
        <Text style={styles.bannerText}>
          Learn from expert-led courses with certificates.
        </Text>
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Featured Courses</Text>
        <View style={styles.sectionPill}>
          <Text style={styles.sectionPillText}>{courses.length} courses</Text>
        </View>
      </View>

      {courses.map((course) => {
        const completedCount = user?.completedLessons?.[course.id]?.length || 0;
        const totalLessons = course.modules.length;

        const isCompleted = totalLessons > 0 && completedCount === totalLessons;

        const isEnrolled =
          user?.enrolledCourses.includes(course.id) ||
          user?.purchasedCourses.includes(course.id);

        const badgeText = isCompleted
          ? "COMPLETED"
          : isEnrolled
            ? "ENROLLED"
            : course.type === "free"
              ? "FREE"
              : `₹${course.price}`;

        const badgeBg = isCompleted
          ? styles.completedBadgeBg
          : isEnrolled
            ? styles.enrolledBadgeBg
            : course.type === "free"
              ? styles.freeBadgeBg
              : styles.paidBadgeBg;

        const badgeColor = isCompleted
          ? styles.completedBadgeColor
          : isEnrolled
            ? styles.enrolledBadgeColor
            : course.type === "free"
              ? styles.freeBadgeColor
              : styles.paidBadgeColor;

        return (
          <TouchableOpacity
            key={course.id}
            style={styles.card}
            activeOpacity={0.92}
            onPress={() => router.push(`/course/${course.id}` as any)}
          >
            <View style={styles.imageWrapper}>
              <Image source={{ uri: course.image }} style={styles.image} />

              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>{course.category}</Text>
              </View>

              <View style={[styles.typeBadge, badgeBg]}>
                <Text style={[styles.typeBadgeText, badgeColor]}>
                  {badgeText}
                </Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.courseTitle}>{course.title}</Text>

              <View style={styles.instructorRow}>
                <View style={styles.instructorAvatar}>
                  <Text style={styles.instructorInitial}>
                    {course.instructor.name.charAt(0)}
                  </Text>
                </View>

                <Text style={styles.instructor}>{course.instructor.name}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>📚</Text>
                  <Text style={styles.metaText}>
                    {course.modules.length} modules
                  </Text>
                </View>

                <View style={styles.metaDot} />

                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>⏱</Text>
                  <Text style={styles.metaText}>{course.duration}</Text>
                </View>

                <View style={styles.metaDot} />

                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>⭐</Text>
                  <Text style={styles.metaText}>{course.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={styles.learningBtn}
        activeOpacity={0.88}
        onPress={() => router.push("/my-learning")}
      >
        <Text style={styles.learningText}>Go to My Learning</Text>
        <Text style={styles.learningArrow}>→</Text>
      </TouchableOpacity>

      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 18,
  },

  topBrandSection: {
    marginTop: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  logoMark: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#052e16",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    shadowColor: "#052e16",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  logoLeaf: {
    color: "#86efac",
    fontSize: 24,
    fontWeight: "900",
  },

  logoText: {
    fontSize: 21,
    fontWeight: "900",
    color: "#0D2818",
    letterSpacing: 0.8,
  },

  logoTagline: {
    color: "#64748B",
    fontSize: 11.5,
    marginTop: 2,
    fontWeight: "600",
  },

  profileBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D9FBE6",
    shadowColor: "#0D2818",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginLeft: 12,
  },

  profileIcon: {
    fontSize: 19,
  },

  welcomeCard: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5F0E8",
    shadowColor: "#0D2818",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  welcomeLabel: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
  },

  welcomeName: {
    color: "#0D2818",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 4,
  },

  welcomeSubtext: {
    color: "#64748B",
    marginTop: 4,
    fontWeight: "600",
  },

  statsMini: {
    backgroundColor: "#F0FDF4",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9FBE6",
  },

  statsNumber: {
    color: "#166534",
    fontSize: 22,
    fontWeight: "900",
  },

  statsText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
  },

  heading: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0D2818",
    marginTop: 24,
    letterSpacing: -0.8,
  },

  banner: {
    backgroundColor: "#052e16",
    padding: 22,
    borderRadius: 22,
    marginTop: 18,
    overflow: "hidden",
    position: "relative",
  },

  bannerAccent: {
    position: "absolute",
    right: -30,
    top: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#1A7A4A",
    opacity: 0.35,
  },

  bannerTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },

  bannerText: {
    color: "#86efac",
    marginTop: 6,
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: "500",
  },

  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 14,
    gap: 10,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#0D2818",
    letterSpacing: -0.3,
  },

  sectionPill: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },

  sectionPillText: {
    color: "#166534",
    fontSize: 11.5,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginBottom: 18,
    overflow: "hidden",
    shadowColor: "#0D2818",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5F0E8",
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    height: 165,
    width: "100%",
  },

  categoryPill: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(5, 46, 22, 0.85)",
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 20,
  },

  categoryPillText: {
    color: "#86efac",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  typeBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 20,
  },

  freeBadgeBg: {
    backgroundColor: "#DCFCE7",
  },

  paidBadgeBg: {
    backgroundColor: "#FFF7ED",
  },

  completedBadgeBg: {
    backgroundColor: "#DCFCE7",
  },

  enrolledBadgeBg: {
    backgroundColor: "#DBEAFE",
  },

  typeBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  freeBadgeColor: {
    color: "#166534",
  },

  paidBadgeColor: {
    color: "#C2410C",
  },

  completedBadgeColor: {
    color: "#166534",
  },

  enrolledBadgeColor: {
    color: "#1D4ED8",
  },

  cardContent: {
    padding: 16,
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0D2818",
    lineHeight: 24,
    letterSpacing: -0.2,
  },

  instructorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },

  instructorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },

  instructorInitial: {
    fontSize: 12,
    fontWeight: "900",
    color: "#166534",
  },

  instructor: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 13,
  },

  divider: {
    height: 1,
    backgroundColor: "#F0FDF4",
    marginVertical: 12,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  metaIcon: {
    fontSize: 12,
  },

  metaText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
  },

  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#D1D5DB",
  },

  learningBtn: {
    backgroundColor: "#0D2818",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#0D2818",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginTop: 4,
  },

  learningText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 0.2,
  },

  learningArrow: {
    color: "#86efac",
    fontSize: 18,
    fontWeight: "900",
  },
});
