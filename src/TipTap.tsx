// src/Tiptap.jsx
import {
  Editor,
  EditorContent,
  EditorProvider,
  useCurrentEditor,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { useState } from "react";

const MenuBar = ({ editor }: { editor: Editor }) => {
  // const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={"k-btn " + editor.isActive("bold") ?? "bg-slate-500"}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={"k-btn " + editor.isActive("italic") ?? "font-bold italic"}
      >
        italic
      </button>
    </>
  );
};

const Tiptap = () => {
  const extensions = [StarterKit];
  const editorProps = {
    attributes: {
      class:
        "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
    },
  };
  const content = "Edit me ...";

  const editor = useEditor({
    extensions,
    editorProps,
    content,
  }) as Editor;

  return (
    <>
      {/* <div className="k-box">
        <EditorProvider
          slotBefore={<MenuBar />}
          extensions={extensions}
          editorProps={editorProps}
          content={content}
        >
          <></>
        </EditorProvider>
      </div> */}
      <div className="k-box">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      <p className="my-3">
        Output:{" "}
        <pre className="bg-slate-500 text-white p-4 rounded border">
          {editor.getHTML()}
        </pre>
      </p>
    </>
  );
};

export default Tiptap;
