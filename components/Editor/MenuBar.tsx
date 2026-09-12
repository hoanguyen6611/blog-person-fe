import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Underline,
  List,
  ListOrdered,
  Strikethrough,
  Link2Icon,
  CodeIcon,
  ListCheck,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "../Toggle";
import { cn } from "@/lib/utils";

// !-prefixed on the data-[state=on] variants: Toggle's own base classes
// already set data-[state=on]:bg-accent/text-accent-foreground, and cn()
// here is plain concatenation (no tailwind-merge to drop the conflicting
// base utility), so without !important the winner would depend on
// Tailwind's generated stylesheet order rather than this override.
const toggleClass =
  "h-8 w-8 rounded-lg text-muted hover:bg-surface-2 hover:text-ink data-[state=on]:!bg-accent-soft data-[state=on]:!text-accent-ink";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const groups = [
    [
      {
        icon: <Heading1 className="size-4" />,
        onClick: () =>
          editor.chain().focus().toggleHeading({ level: 1 }).run(),
        pressed: editor.isActive("heading", { level: 1 }),
        testId: "editor-heading1-button",
      },
      {
        icon: <Heading2 className="size-4" />,
        onClick: () =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
        pressed: editor.isActive("heading", { level: 2 }),
        testId: "editor-heading2-button",
      },
      {
        icon: <Heading3 className="size-4" />,
        onClick: () =>
          editor.chain().focus().toggleHeading({ level: 3 }).run(),
        pressed: editor.isActive("heading", { level: 3 }),
        testId: "editor-heading3-button",
      },
    ],
    [
      {
        icon: <Bold className="size-4" />,
        onClick: () => editor.chain().focus().toggleBold().run(),
        pressed: editor.isActive("bold"),
        testId: "editor-bold-button",
      },
      {
        icon: <Italic className="size-4" />,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        pressed: editor.isActive("italic"),
        testId: "editor-italic-button",
      },
      {
        icon: <Underline className="size-4" />,
        onClick: () => editor.chain().focus().toggleUnderline().run(),
        pressed: editor.isActive("underline"),
        testId: "editor-underline-button",
      },
      {
        icon: <Strikethrough className="size-4" />,
        onClick: () => editor.chain().focus().toggleStrike().run(),
        pressed: editor.isActive("strike"),
        testId: "editor-strike-button",
      },
    ],
    [
      {
        icon: <AlignLeft className="size-4" />,
        onClick: () => editor.chain().focus().setTextAlign("left").run(),
        pressed: editor.isActive({ textAlign: "left" }),
        testId: "editor-align-left-button",
      },
      {
        icon: <AlignCenter className="size-4" />,
        onClick: () => editor.chain().focus().setTextAlign("center").run(),
        pressed: editor.isActive({ textAlign: "center" }),
        testId: "editor-align-center-button",
      },
      {
        icon: <AlignRight className="size-4" />,
        onClick: () => editor.chain().focus().setTextAlign("right").run(),
        pressed: editor.isActive({ textAlign: "right" }),
        testId: "editor-align-right-button",
      },
    ],
    [
      {
        icon: <List className="size-4" />,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        pressed: editor.isActive("bulletList"),
        testId: "editor-bullet-list-button",
      },
      {
        icon: <ListOrdered className="size-4" />,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        pressed: editor.isActive("orderedList"),
        testId: "editor-ordered-list-button",
      },
      {
        icon: <ListCheck className="size-4" />,
        onClick: () => editor.chain().focus().toggleTaskList().run(),
        pressed: editor.isActive("taskList"),
        testId: "editor-task-list-button",
      },
    ],
    [
      {
        icon: <Highlighter className="size-4" />,
        onClick: () => editor.chain().focus().toggleHighlight().run(),
        pressed: editor.isActive("highlight"),
        testId: "editor-highlight-button",
      },
      {
        icon: <Link2Icon className="size-4" />,
        onClick: () => {
          const url = window.prompt("Enter URL:");
          if (url) {
            editor.chain().focus().toggleLink({ href: url }).run();
          }
        },
        pressed: editor.isActive("link"),
        testId: "editor-link-button",
      },
      {
        icon: <CodeIcon className="size-4" />,
        onClick: () => editor.chain().focus().toggleCodeBlock().run(),
        pressed: editor.isActive("codeBlock"),
        testId: "editor-code-block-button",
      },
    ],
  ];

  return (
    <div
      className="mb-2 flex flex-wrap items-center gap-1 rounded-2xl border border-line-soft bg-surface p-1.5 shadow-sm"
      data-testid="editor-menu-bar"
    >
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-0.5">
          {gi > 0 && <div className="mx-1 h-5 w-px bg-line" />}
          {group.map((option, i) => (
            <Toggle
              key={i}
              pressed={option.pressed}
              onPressedChange={option.onClick}
              className={cn(toggleClass)}
              data-testid={option.testId}
            >
              {option.icon}
            </Toggle>
          ))}
        </div>
      ))}
    </div>
  );
}
