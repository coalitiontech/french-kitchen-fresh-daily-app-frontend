import React, { useEffect, useState } from "react";

import { useQuill } from "react-quilljs";
// or const { useQuill } = require('react-quilljs');

import "quill/dist/quill.snow.css"; // Add css for snow theme
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

export interface QuillJsProps {
    onChangeHandler: (value: string, key: string) => void,
    fieldName: string,
    initialValue: string | null
}

export default function QuillJs({ onChangeHandler, fieldName, initialValue = null }: QuillJsProps) {
    const { quill, quillRef } = useQuill({
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ align: [] }],

                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],

                [{ size: ['small', false, 'large', 'huge'] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['link'],
                [{ color: [] }, { background: [] }],

                ['clean'],
            ],
            clipboard: {
                matchVisual: false,
            },
        }
    });

    const [shouldStart, setShouldStart] = useState(true);

    useEffect(() => {
        if (shouldStart && quill && initialValue) {
            quill.clipboard.dangerouslyPasteHTML(initialValue);
            setShouldStart(false)
        }
        if (quill) {
            quill.on('text-change', (delta, oldDelta, source) => {
                onChangeHandler(quill.root.innerHTML, fieldName)
            });
        }
    }, [quill]);

    return (
        <div style={{ width: '100%', height: "70%" }}>
            <div ref={quillRef} />
        </div>
    );
};
