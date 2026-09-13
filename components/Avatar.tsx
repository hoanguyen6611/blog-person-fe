import ImageShow from "./Image";
import { isPlaceholderAvatar } from "@/lib/avatar";
import { cn } from "@/lib/utils";

const INITIALS_COLORS = [
  "bg-avatar-blue-bg text-avatar-blue-text",
  "bg-avatar-amber-bg text-avatar-amber-text border border-avatar-amber-border",
  "bg-avatar-gray-bg text-avatar-gray-text",
];

function colorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return INITIALS_COLORS[Math.abs(hash) % INITIALS_COLORS.length];
}

// Drop-in for anywhere a user's avatar is shown: falls back to an initials
// circle instead of Gravatar's generic silhouette when there's no real
// photo on file (see lib/avatar.ts for why that happens).
const Avatar = ({
  src,
  name,
  size = 36,
  className,
}: {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}) => {
  if (isPlaceholderAvatar(src)) {
    return (
      <span
        className={cn(
          "flex flex-none items-center justify-center rounded-full font-semibold",
          colorForName(name || "?"),
          className
        )}
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        data-testid="avatar-initials"
      >
        {(name || "?").charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <ImageShow
      src={src || ""}
      alt={name}
      width={size}
      height={size}
      className={cn("flex-none rounded-full object-cover", className)}
    />
  );
};

export default Avatar;
