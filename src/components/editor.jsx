import { cn } from '@/lib/utils'
import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect } from 'react'

import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Image from '@tiptap/extension-image'
import Mention from '@tiptap/extension-mention'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'

const Editor = ({ className, content }) => {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({
        history: true,
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      Mention.configure({
        HTMLAttributes: {
          class: 'px-2 py-1 bg-accent rounded-md',
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: 'underline-offset-2',
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'underline-offset-2 underline',
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  return (
    <div className={cn('flex w-full max-w-3xl flex-col gap-4', className)}>
      <EditorContent
        editor={editor}
        className={cn(
          '[&_h1]:scroll-m-20 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:lg:text-5xl',
          '[&_h2]:mt-10 [&_h2]:scroll-m-20 [&_h2]:border-b [&_h2]:pb-2 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:first:mt-0',
          '[&_h3]:mt-8 [&_h3]:scroll-m-20 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight',
          '[&_h4]:mt-6 [&_h4]:scroll-m-20 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:tracking-tight',
          '[&_p]:leading-7 [&_p:not(:first-child)]:mt-6',
          '[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-6 [&_blockquote]:italic',
          '[&_ul]:my-6 [&_ul]:ml-6 [&_ul]:list-disc [&_ul>li]:mt-2',
          '[&_ol]:my-6 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol>li]:mt-2',
          '[&_table]:my-6 [&_table]:w-full',
          '[&_tr]:m-0 [&_tr]:border-t [&_tr]:p-0',
          '[&_td.selectedCell]:bg-muted/40 [&_th]:border [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-bold [&_th[align=center]]:text-center [&_th[align=right]]:text-right',
          '[&_th.selectedCell]:bg-muted/40 [&_td]:border [&_td]:px-4 [&_td]:py-2 [&_td]:text-left [&_td[align=center]]:text-center [&_td[align=right]]:text-right',
          '[&_img]:h-auto [&_img]:w-full [&_img]:rounded-lg [&_img]:object-cover [&_img]:transition-all [&_img.ProseMirror-selectednode]:outline-2 [&_img.ProseMirror-selectednode]:outline-offset-2 [&_img:not(:first-child)]:mt-6'
        )}
      />
    </div>
  )
}

export default Editor
