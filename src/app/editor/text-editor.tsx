'use client'

import React from 'react';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";

export function TextEditor({ initialData, onChange } : { initialData : any, onChange? : Function }){
    return <CKEditor
        editor={ Editor }
        onReady={
            (editor)=>{
                editor.editing.view.change((writer : any) => {
                    writer.setStyle( "height", "512px", editor.editing.view.document.getRoot() );
                    writer.setStyle( "width", "100%", editor.editing.view.document.getRoot() );
                });
            }
        }
        data={ initialData }
        onChange={ (event, editor ) => {
            const data = editor.getData();
            onChange && onChange( data )
        } }
    />
}