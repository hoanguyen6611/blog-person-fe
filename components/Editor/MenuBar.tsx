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

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive("heading", { level: 1 }),
      testId: "editor-heading1-button",
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive("heading", { level: 2 }),
      testId: "editor-heading2-button",
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive("heading", { level: 3 }),
      testId: "editor-heading3-button",
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive("bold"),
      testId: "editor-bold-button",
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive("italic"),
      testId: "editor-italic-button",
    },
    {
      icon: <Underline className="size-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      preesed: editor.isActive("underline"),
      testId: "editor-underline-button",
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive("strike"),
      testId: "editor-strike-button",
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      preesed: editor.isActive({ textAlign: "left" }),
      testId: "editor-align-left-button",
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      preesed: editor.isActive({ textAlign: "center" }),
      testId: "editor-align-center-button",
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      preesed: editor.isActive({ textAlign: "right" }),
      testId: "editor-align-right-button",
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive("bulletList"),
      testId: "editor-bullet-list-button",
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive("orderedList"),
      testId: "editor-ordered-list-button",
    },
    {
      icon: <ListCheck className="size-4" />,
      onClick: () => editor.chain().focus().toggleTaskList().run(),
      preesed: editor.isActive("taskList"),
      testId: "editor-task-list-button",
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: editor.isActive("highlight"),
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
      preesed: editor.isActive("link"),
      testId: "editor-link-button",
    },
    {
      icon: <CodeIcon className="size-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      preesed: editor.isActive("codeBlock"),
      testId: "editor-code-block-button",
    },
  ];

  return (
    <div
      className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50"
      data-testid="editor-menu-bar"
    >
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.preesed}
          onPressedChange={option.onClick}
          data-testid={option.testId}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}
