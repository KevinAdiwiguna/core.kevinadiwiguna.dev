"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Code, Undo, Redo, LucideIcon } from "lucide-react";

interface EditorProps {
	content: string;
	onChange: (content: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [StarterKit],
		content: content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: "prose prose-invert max-w-none min-h-[300px] p-4 focus:outline-none font-mono text-sm",
			},
		},
	});

	if (!editor) return null;

	return (
		<div className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-950/20">
			<div className="flex flex-wrap gap-1 p-2 border-b border-zinc-800 bg-zinc-900/50">
				<MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} icon={Bold} />
				<MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} icon={Italic} />
				<MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} icon={Heading1} />
				<MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} icon={Heading2} />
				<MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} icon={List} />
				<MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} icon={ListOrdered} />
				<MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} icon={Quote} />
				<MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} icon={Code} />
				<div className="w-px h-6 bg-zinc-800 mx-1 self-center" />
				<MenuButton onClick={() => editor.chain().focus().undo().run()} icon={Undo} />
				<MenuButton onClick={() => editor.chain().focus().redo().run()} icon={Redo} />
			</div>
			<EditorContent editor={editor} />
		</div>
	);
}

interface MenuButtonProps {
	onClick: () => void;
	active?: boolean;
	icon: LucideIcon;
}

function MenuButton({ onClick, active, icon: Icon }: MenuButtonProps) {
	return (
		<button type="button" onClick={onClick} className={`p-2 rounded hover:bg-zinc-800 transition-colors ${active ? "text-terminal-green bg-zinc-800" : "text-zinc-500"}`}>
			<Icon size={16} />
		</button>
	);
}
