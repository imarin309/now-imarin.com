import { ReactNode } from "react";

type CalloutType = "warning" | "info" | "note";

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
}

const config: Record<
  CalloutType,
  { icon: string; label: string; className: string }
> = {
  warning: {
    icon: "⚠️",
    label: "注意",
    className: "border-yellow-400 bg-yellow-50 text-yellow-900",
  },
  info: {
    icon: "ℹ️",
    label: "情報",
    className: "border-blue-400 bg-blue-50 text-blue-900",
  },
  note: {
    icon: "📝",
    label: "メモ",
    className: "border-gray-400 bg-gray-50 text-gray-800",
  },
};

export function Callout({ type = "warning", children }: CalloutProps) {
  const { icon, label, className } = config[type];
  return (
    <div
      className={`not-prose my-4 flex gap-3 rounded-lg border-l-4 px-4 py-3 ${className}`}
    >
      <span className="mt-0.5 shrink-0 text-lg leading-snug">{icon}</span>
      <div className="text-sm italic leading-relaxed [&_a]:underline [&_p]:inline">
        <span className="mr-1 font-bold not-italic">{label}</span>
        {children}
      </div>
    </div>
  );
}
