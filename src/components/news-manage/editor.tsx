import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

export default function DraftEditor(props: {
  getContent: (content: string) => void
  content?: string
}) {
  const [editorState, setEditorState] = useState<EditorState>(
    props.content
      ? EditorState.createWithContent(
          ContentState.createFromBlockArray(
            htmlToDraft(props.content!).contentBlocks,
          ),
        )
      : EditorState.createEmpty(),
  )
  // 当有默认数据的时候就保存起来
  useEffect(() => {
    if (props.content) {
      props.getContent(props.content!)
    }
  }, [props.content])

  return (
    <div>
      <Editor
        // 失去焦点的时候设置
        onBlur={() => {
          const content = draftToHtml(
            convertToRaw(editorState.getCurrentContent()),
          )
          props.getContent(content)
        }}
        editorState={editorState}
        onEditorStateChange={(editorState: EditorState) => {
          setEditorState(editorState)
        }}
      />
    </div>
  )
}
