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
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react";

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

  const toggleOrderList = useCallback(() => {
    editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  const openModal = useCallback(() => {
    console.log(editor.chain().focus());
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
      console.log("save link");
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
          className="w-8"
        >
          <IconBold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={toggleItalic}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          size="icon"
          className="w-8"
        >
          <IconItalic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={toggleStrike}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          size="icon"
          className="w-8"
        >
          <IconStrikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={toggleUnderline}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          size="icon"
          className="w-8"
        >
          <IconUnderline className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={openModal}
          disabled={!editor.can().chain().focus()}
          size="icon"
          className="w-8"
        >
          <IconLink className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={toggleBulletList}
          size="icon"
          className="w-8"
        >
          <IconList className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={toggleOrderList}
          size="icon"
          className="w-8"
        >
          <IconListNumbers className="h-4 w-4" />
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
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-1 focus:outline-none min-h-16 mt-2",
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
