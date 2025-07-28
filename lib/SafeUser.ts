function toISOStringSafe(value: any) {
  if (!value) return null;
  if (typeof value === "string") return value;  // already ISO string
  if (value instanceof Date) return value.toISOString(); // convert if Date
  return null;
}

export default function SafeUser(user: any | null) {
  if (!user) return null;

  return {
    ...user,
    createdAt: toISOStringSafe(user.createdAt),
    updatedAt: toISOStringSafe(user.updatedAt),
    emailVerified: toISOStringSafe(user.emailVerified),
  };
}
