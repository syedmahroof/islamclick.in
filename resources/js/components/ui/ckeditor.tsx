import React, { useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorComponentProps {
    value: string;
    onChange: (data: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function CKEditorComponent({
    value,
    onChange,
    placeholder = 'Enter content...',
    disabled = false,
    className = ''
}: CKEditorComponentProps) {
    const editorRef = useRef<any>(null);

    useEffect(() => {
        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className={className}>
            <CKEditor
                editor={ClassicEditor}
                data={value}
                onReady={(editor) => {
                    editorRef.current = editor;
                    editor.editing.view.change((writer) => {
                        writer.setStyle('min-height', '300px', editor.editing.view.document.getRoot());
                    });
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
                config={{
                    placeholder,
                    toolbar: [
                        'heading', '|',
                        'bold', 'italic', 'underline', 'strikethrough', '|',
                        'link', 'bulletedList', 'numberedList', '|',
                        'outdent', 'indent', '|',
                        'blockQuote', 'insertTable', '|',
                        'undo', 'redo'
                    ],
                    heading: {
                        options: [
                            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                        ]
                    }
                }}
                disabled={disabled}
            />
        </div>
    );
}



