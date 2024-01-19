import { BubbleMenu, Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  IconBold,
  IconH1,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";

const MenuBar = ({ editor }: { editor: Editor }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState<string>("");

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  // const toggleCode = useCallback(() => {
  //   editor.chain().focus().toggleCode().run();
  // }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  const openModal = useCallback(() => {
    setUrl(editor.getAttributes("link").href ?? "");
    setIsOpen(true);
  }, [editor]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setUrl("");
  }, []);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    closeModal();
  }, [editor, closeModal]);

  const saveLink = useCallback(() => {
    if (url === "" && editor.isActive("link")) {
      removeLink();
      return;
    } else if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    closeModal();
  }, [closeModal, editor, removeLink, url]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveLink();
    }
  };

  const toggleHeading = useCallback(
    (level: 1 | 2 | 3) => {
      editor.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  return (
    <>
      <Dialog open={modalIsOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Link</DialogTitle>
          </DialogHeader>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </DialogContent>
      </Dialog>

      <BubbleMenu
        className="p-2 flex gap-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        tippyOptions={{ duration: 150 }}
        editor={editor}
        shouldShow={({ editor, from, to }) => {
          // only show the bubble menu for links.
          if (from === to && editor.isActive("link")) {
            setUrl(editor.getAttributes("link").href ?? "");
            return true;
          }
          return false;
        }}
      >
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </BubbleMenu>

      <div className="">
        <Button
          variant="ghost"
          onClick={toggleBold}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          size="icon"
          className={editor.isActive("bold") ? "bg-slate-200" : ""}
        >
          <IconBold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={toggleItalic}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          size="icon"
          className={editor.isActive("italic") ? "bg-slate-200" : ""}
        >
          <IconItalic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={toggleStrike}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          size="icon"
          className={editor.isActive("strike") ? "bg-slate-200" : ""}
        >
          <IconStrikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={toggleUnderline}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          size="icon"
          className={editor.isActive("underline") ? "bg-slate-200" : ""}
        >
          <IconUnderline className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={openModal}
          disabled={!editor.can().chain().focus()}
          size="icon"
          className={editor.isActive("link") ? "bg-slate-200" : ""}
        >
          <IconLink className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={toggleBulletList}
          size="icon"
          className={editor.isActive("bulletList") ? "bg-slate-200" : ""}
        >
          <IconList className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={toggleOrderedList}
          size="icon"
          className={editor.isActive("orderedList") ? "bg-slate-200" : ""}
        >
          <IconListNumbers className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => toggleHeading(1)}
          size="icon"
          className={editor.isActive("heading") ? "bg-slate-200" : ""}
        >
          <IconH1 className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const KTextEditor = (props: EditorProps) => {
  const { value, onChange } = props;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "k-order-lists",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "k-bullet-lists",
          },
        },
        hardBreak: {
          HTMLAttributes: {
            class: "my-1",
          },
        },
      }),
      Heading.configure({
        HTMLAttributes: {
          class: "text-2xl",
        },
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: "min-h-4",
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        validate: (href) => /^https?:\/\//.test(href),
        HTMLAttributes: {
          class: "k-link",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-1 focus:outline-none min-h-16",
      },
    },
    content: value,
    onUpdate({ editor }) {
      onChange && onChange(editor.getHTML());
    },
  }) as Editor;

  return (
    <div className="k-container">
      <MenuBar editor={editor} />

      <EditorContent editor={editor}></EditorContent>
    </div>
  );
};

export default KTextEditor;
