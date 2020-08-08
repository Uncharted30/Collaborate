import React from 'react';
import './EditPage.css'
import CodeEditor from "../../components/CodeEditor";

class EditPage extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.onChange = this.onChange.bind(this);
    }

    onChange(newValue) {
        console.log('change', newValue);
    }

    render() {
        return (
            <div id='edit-page-editor-div'>
                <CodeEditor id='editor'/>
            </div>
        );
    }
}

export default EditPage
