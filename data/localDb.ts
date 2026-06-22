import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "users";
const CURRENT_USER_KEY = "current_user";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  enrolledCourses: string[];
  purchasedCourses: string[];
  completedLessons: {
    [courseId: string]: string[];
  };
  certificates: string[];
  createdAt: string;
};

export async function getUsers(): Promise<User[]> {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveUsers(users: User[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function signupUser(
  name: string,
  email: string,
  password: string,
) {
  const users = await getUsers();

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );

  if (existingUser) {
    return {
      success: false,
      message: "Email already exists",
    };
  }

  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password,
    enrolledCourses: [],
    purchasedCourses: [],
    completedLessons: {},
    certificates: [],
    createdAt: new Date().toISOString(),
  };

  await saveUsers([...users, newUser]);

  return {
    success: true,
    user: newUser,
  };
}

export async function loginUser(email: string, password: string) {
  const users = await getUsers();

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.password === password,
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  return {
    success: true,
    user,
  };
}

export async function resetPassword(email: string, newPassword: string) {
  const users = await getUsers();

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );

  if (!existingUser) {
    return {
      success: false,
      message: "No account found with this email",
    };
  }

  const updatedUsers = users.map((user) =>
    user.email.toLowerCase() === email.toLowerCase()
      ? { ...user, password: newPassword }
      : user,
  );

  await saveUsers(updatedUsers);

  return {
    success: true,
    message: "Password reset successful. Please login.",
  };
}

export async function getCurrentUser(): Promise<User | null> {
  const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function logoutUser() {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

export async function enrollFreeCourse(courseId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const users = await getUsers();

  const updatedUser = {
    ...currentUser,
    enrolledCourses: [...new Set([...currentUser.enrolledCourses, courseId])],
  };

  const updatedUsers = users.map((user) =>
    user.id === currentUser.id ? updatedUser : user,
  );

  await saveUsers(updatedUsers);
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  return updatedUser;
}

export async function purchaseCourse(courseId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const users = await getUsers();

  const updatedUser = {
    ...currentUser,
    purchasedCourses: [...new Set([...currentUser.purchasedCourses, courseId])],
    enrolledCourses: [...new Set([...currentUser.enrolledCourses, courseId])],
  };

  const updatedUsers = users.map((user) =>
    user.id === currentUser.id ? updatedUser : user,
  );

  await saveUsers(updatedUsers);
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  return updatedUser;
}

export async function markLessonComplete(courseId: string, lessonId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const users = await getUsers();

  const existingCompleted = currentUser.completedLessons?.[courseId] || [];

  const updatedUser = {
    ...currentUser,
    completedLessons: {
      ...currentUser.completedLessons,
      [courseId]: [...new Set([...existingCompleted, lessonId])],
    },
  };

  const updatedUsers = users.map((user) =>
    user.id === currentUser.id ? updatedUser : user,
  );

  await saveUsers(updatedUsers);
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  return updatedUser;
}

export async function addCertificate(courseId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const users = await getUsers();

  const updatedUser = {
    ...currentUser,
    certificates: [...new Set([...(currentUser.certificates || []), courseId])],
  };

  const updatedUsers = users.map((user) =>
    user.id === currentUser.id ? updatedUser : user,
  );

  await saveUsers(updatedUsers);
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  return updatedUser;
}
