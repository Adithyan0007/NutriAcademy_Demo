import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { courses } from "../../data/courses";
import {
  addCertificate,
  enrollFreeCourse,
  getCurrentUser,
  purchaseCourse,
  User,
} from "../../data/localDb";

export default function CourseDetails() {
  const { id } = useLocalSearchParams();
  const courseId = Array.isArray(id) ? id[0] : id;

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
      </View>
    );
  }

  const course = foundCourse;

  const completedLessons = user?.completedLessons?.[course.id] || [];
  const totalLessons = course.modules.length;
  const completedCount = completedLessons.length;

  const hasAccess =
    user?.enrolledCourses.includes(course.id) ||
    user?.purchasedCourses.includes(course.id) ||
    false;

  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isCourseCompleted = totalLessons > 0 && completedCount === totalLessons;

  const hasCertificate = user?.certificates?.includes(course.id) || false;

  async function downloadCertificate() {
    if (!user) return;

    const html = `
      <html>
        <body style="
          font-family: Arial, sans-serif;
          padding: 40px;
          background: #f0fdf4;
          text-align: center;
        ">
          <div style="
            background: white;
            border: 10px solid #166534;
            padding: 50px;
            min-height: 520px;
          ">
            <p style="
              color: #166534;
              font-size: 14px;
              font-weight: bold;
              letter-spacing: 3px;
              text-transform: uppercase;
            ">
              Nutrition Academy
            </p>

            <h1 style="
              color: #0d2818;
              font-size: 42px;
              margin-top: 20px;
              margin-bottom: 10px;
            ">
              Certificate of Completion
            </h1>

            <p style="
              color: #475569;
              font-size: 18px;
              margin-top: 35px;
            ">
              This certificate is proudly presented to
            </p>

            <h2 style="
              color: #166534;
              font-size: 34px;
              margin: 18px 0;
            ">
              ${user.name}
            </h2>

            <p style="
              color: #475569;
              font-size: 18px;
            ">
              for successfully completing the course
            </p>

            <h2 style="
              color: #0d2818;
              font-size: 28px;
              margin: 18px 0;
            ">
              ${course.title}
            </h2>

            <p style="
              color: #64748b;
              font-size: 16px;
              line-height: 24px;
              margin-top: 25px;
            ">
              This course included ${course.modules.length} learning modules
              in ${course.category}.
            </p>

            <div style="
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            ">
              <div style="text-align: left;">
                <p style="color:#64748b; margin:0;">Date</p>
                <p style="color:#0d2818; font-weight:bold;">
                  ${new Date().toLocaleDateString()}
                </p>
              </div>

              <div style="text-align: right;">
                <p style="color:#64748b; margin:0;">Issued By</p>
                <p style="color:#0d2818; font-weight:bold;">
                  Nutrition Academy
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("Certificate Created", `Saved at: ${uri}`);
    }
  }

  function getNextLesson() {
    return (
      course.modules.find((module) => !completedLessons.includes(module.id)) ||
      course.modules[0]
    );
  }

  function isModuleUnlocked(index: number) {
    if (!hasAccess) return false;
    if (index === 0) return true;

    const previousModule = course.modules[index - 1];
    return completedLessons.includes(previousModule.id);
  }

  async function handleCourseAction() {
    if (!user) {
      router.replace("/");
      return;
    }

    if (!hasAccess) {
      if (course.type === "free") {
        await enrollFreeCourse(course.id);
        await loadUser();

        const firstLesson = course.modules[0];

        router.push({
          pathname: "/lesson/[courseId]/[lessonId]" as any,
          params: {
            courseId: course.id,
            lessonId: firstLesson.id,
          },
        });

        return;
      }

      await purchaseCourse(course.id);
      await loadUser();

      const firstLesson = course.modules[0];

      Alert.alert("Purchase successful", "Course unlocked successfully");

      router.push({
        pathname: "/lesson/[courseId]/[lessonId]" as any,
        params: {
          courseId: course.id,
          lessonId: firstLesson.id,
        },
      });

      return;
    }

    if (isCourseCompleted) {
      if (!hasCertificate) {
        await addCertificate(course.id);
        await loadUser();
      }

      await downloadCertificate();
      return;
    }

    const nextLesson = getNextLesson();

    router.push({
      pathname: "/lesson/[courseId]/[lessonId]" as any,
      params: {
        courseId: course.id,
        lessonId: nextLesson.id,
      },
    });
  }

  const mainButtonText = !hasAccess
    ? course.type === "free"
      ? "Start Learning"
      : `Buy Now - ₹${course.price}`
    : isCourseCompleted
      ? "Download Certificate"
      : completedCount > 0
        ? `Resume Course • ${completedCount}/${totalLessons} completed`
        : "Start Learning";

  const badgeText = isCourseCompleted
    ? "COMPLETED"
    : hasAccess
      ? "ENROLLED"
      : course.type === "free"
        ? "FREE"
        : `₹${course.price}`;

  const badgeStyle = isCourseCompleted
    ? styles.completedBadge
    : hasAccess
      ? styles.enrolledBadge
      : course.type === "free"
        ? styles.freeBadge
        : styles.paidBadge;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: course.image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.category}>{course.category}</Text>
          <Text style={badgeStyle}>{badgeText}</Text>
        </View>

        <Text style={styles.title}>{course.title}</Text>

        <Text style={styles.meta}>
          {course.modules.length} modules • {course.duration} • ⭐{" "}
          {course.rating}
        </Text>

        <Text style={styles.students}>
          {course.students}+ students enrolled
        </Text>

        {hasAccess && (
          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <View>
                <Text style={styles.progressTitle}>
                  {isCourseCompleted ? "Course Completed" : "Resume Course"}
                </Text>

                <Text style={styles.progressText}>
                  {completedCount}/{totalLessons} completed • {progressPercent}%
                </Text>
              </View>

              <Text style={styles.progressPercent}>{progressPercent}%</Text>
            </View>

            <View style={styles.progressBg}>
              <View
                style={[styles.progressFill, { width: `${progressPercent}%` }]}
              />
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleCourseAction}>
          <Text style={styles.buttonText}>{mainButtonText}</Text>
        </TouchableOpacity>

        <Text style={styles.section}>About this course</Text>
        <Text style={styles.description}>{course.description}</Text>

        <Text style={styles.section}>Instructor</Text>

        <View style={styles.instructorCard}>
          <View style={styles.instructorAvatar}>
            <Text style={styles.instructorInitial}>
              {course.instructor.name.charAt(0)}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.instructorName}>{course.instructor.name}</Text>
            <Text style={styles.instructorText}>
              {course.instructor.qualification}
            </Text>
            <Text style={styles.instructorText}>
              {course.instructor.experience} Experience
            </Text>
          </View>
        </View>

        <Text style={styles.section}>Course Reading Content</Text>

        {course.modules.map((module, index) => {
          const isDone = completedLessons.includes(module.id);
          const unlocked = isModuleUnlocked(index);

          return (
            <TouchableOpacity
              key={module.id}
              style={[styles.lessonCard, !unlocked && styles.lockedLessonCard]}
              activeOpacity={0.9}
              onPress={() => {
                if (!hasAccess) {
                  Alert.alert(
                    "Access required",
                    "Please enroll or purchase this course first.",
                  );
                  return;
                }

                if (!unlocked) {
                  Alert.alert(
                    "Module Locked",
                    "Please complete the previous module first.",
                  );
                  return;
                }

                router.push({
                  pathname: "/lesson/[courseId]/[lessonId]" as any,
                  params: {
                    courseId: course.id,
                    lessonId: module.id,
                  },
                });
              }}
            >
              <View style={styles.lessonLeft}>
                <View
                  style={[
                    styles.lessonNumber,
                    isDone && styles.lessonNumberDone,
                    !unlocked && styles.lessonNumberLocked,
                  ]}
                >
                  <Text
                    style={[
                      styles.lessonNumberText,
                      isDone && styles.lessonNumberTextDone,
                    ]}
                  >
                    {isDone ? "✓" : !unlocked ? "🔒" : module.id}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.lessonTitle}>{module.title}</Text>
                  <Text style={styles.lessonTime}>
                    {module.readingTime} reading
                  </Text>
                </View>
              </View>

              <Text
                style={
                  isDone
                    ? styles.completed
                    : !unlocked
                      ? styles.locked
                      : styles.pending
                }
              >
                {isDone ? "Done" : !unlocked ? "Locked" : "Start"}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 35 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0FDF4" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
  },

  errorText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0D2818",
  },

  image: {
    height: 280,
    width: "100%",
  },

  content: {
    padding: 20,
    marginTop: -24,
    backgroundColor: "#F0FDF4",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  category: {
    color: "#166534",
    fontWeight: "900",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  freeBadge: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    fontWeight: "900",
    fontSize: 12,
  },

  paidBadge: {
    backgroundColor: "#FFF7ED",
    color: "#C2410C",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    fontWeight: "900",
    fontSize: 12,
  },

  enrolledBadge: {
    backgroundColor: "#DBEAFE",
    color: "#1D4ED8",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    fontWeight: "900",
    fontSize: 12,
  },

  completedBadge: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    fontWeight: "900",
    fontSize: 12,
  },

  title: {
    fontSize: 29,
    fontWeight: "900",
    color: "#0D2818",
    marginTop: 12,
    letterSpacing: -0.7,
    lineHeight: 36,
  },

  meta: {
    color: "#64748B",
    marginTop: 8,
    fontWeight: "600",
  },

  students: {
    color: "#475569",
    marginTop: 6,
    fontWeight: "700",
  },

  progressCard: {
    backgroundColor: "#FFFFFF",
    padding: 17,
    borderRadius: 20,
    marginTop: 22,
    borderWidth: 1,
    borderColor: "#D9FBE6",
  },

  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0D2818",
  },

  progressText: {
    color: "#6B7280",
    marginTop: 6,
    fontWeight: "700",
  },

  progressPercent: {
    color: "#166534",
    fontWeight: "900",
    fontSize: 18,
  },

  progressBg: {
    height: 10,
    backgroundColor: "#DCFCE7",
    borderRadius: 20,
    marginTop: 14,
    overflow: "hidden",
  },

  progressFill: {
    height: 10,
    backgroundColor: "#166534",
    borderRadius: 20,
  },

  button: {
    backgroundColor: "#166534",
    padding: 16,
    borderRadius: 18,
    marginTop: 24,
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 15,
  },

  section: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0D2818",
    marginTop: 28,
    marginBottom: 10,
  },

  description: {
    color: "#475569",
    lineHeight: 24,
    fontSize: 15,
    fontWeight: "500",
  },

  instructorCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5F0E8",
    flexDirection: "row",
    alignItems: "center",
  },

  instructorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  instructorInitial: {
    color: "#166534",
    fontSize: 20,
    fontWeight: "900",
  },

  instructorName: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0D2818",
  },

  instructorText: {
    color: "#64748B",
    marginTop: 3,
    fontWeight: "600",
  },

  lessonCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5F0E8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  lockedLessonCard: {
    opacity: 0.65,
  },

  lessonLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  lessonNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  lessonNumberDone: {
    backgroundColor: "#166534",
  },

  lessonNumberLocked: {
    backgroundColor: "#F3F4F6",
  },

  lessonNumberText: {
    color: "#166534",
    fontWeight: "900",
  },

  lessonNumberTextDone: {
    color: "#FFFFFF",
  },

  lessonTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0D2818",
  },

  lessonTime: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },

  completed: {
    color: "#166534",
    fontWeight: "900",
    fontSize: 12,
  },

  pending: {
    color: "#F97316",
    fontWeight: "900",
    fontSize: 12,
  },

  locked: {
    color: "#9CA3AF",
    fontWeight: "900",
    fontSize: 12,
  },

  back: {
    color: "#166534",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "900",
  },
});
