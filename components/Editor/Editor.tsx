import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Underline from "@tiptap/extension-underline";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}
export type EditorHandle = {
  insertImage: (url: string) => void;
};
const Editor = forwardRef<EditorHandle, EditorProps>(
  ({ content, onChange }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          bulletList: {
            HTMLAttributes: {
              class: "list-disc ml-3",
            },
          },
          orderedList: {
            HTMLAttributes: {
              class: "list-decimal ml-3",
            },
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Highlight,
        Image.configure({
          inline: true,
        }),
        Link,
        CodeBlock.configure({
          languageClassPrefix: "language-",
          defaultLanguage: "plaintext",
          HTMLAttributes: {
            class: "my-custom-class",
          },
        }),
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        Underline,
      ],
      content: content,
      editorProps: {
        attributes: {
          class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3",
        },
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });
    useImperativeHandle(ref, () => ({
      insertImage: (url: string) => {
        if (editor) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
    }));
    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }, [content, editor]);

    return (
      <div>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    );
  }
);
Editor.displayName = "Editor";
export default Editor;
