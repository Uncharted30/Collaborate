import {axiosInstance as axios} from "./axios";
import {message} from "antd";

const saveFile = (data) => {
    return new Promise((resolve, reject) => {
        axios.put('/api/document', data).then(res => {
            if (res.data.msg === 'success') {
                // console.log(res.data.doc.lastEdited)
                resolve(res)
            } else {
                reject('Error saving file. ' + res.data.msg)
            }
        }).catch(e => {
            reject('Error saving file. ' + e.message)
        })
    })
}

const deleteFile = (id, fetchData) => {
    axios.delete('/api/document/' + id).then(res => {
        if (res.data.msg === 'success') {
            message.success('Success.')
            fetchData()
        } else {
            message.error('Error deleting file. ' + res.data.msg)
        }
    }).catch(e => {
        message.error("Error deleting file. " + e.message)
    })
}

const makeCopy = (docId) => {
    return new Promise((resolve, reject) => {
        axios.post('/api/document/copy', {id: docId}).then(res => {
            if (res.data.msg === 'success') {
                resolve(res.data.id)
            } else {
                reject(res.data.msg)
            }
        }).catch(e => {
            reject(e.message)
        })
    })
}

const createNewFile = (type, history) => {
    axios.post('/api/document/new', {
        type: type
    }).then(res => {
        if (res.data.msg === 'success') {
            history.push('/empty')
            history.replace('/edit/' + res.data.id);
        } else {
            message.error(res.data.msg)
        }
    }).catch(e => {
        message.error('Error creating new file. ' + e.message)
    });
}

export {
    saveFile,
    deleteFile,
    makeCopy,
    createNewFile
}