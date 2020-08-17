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
            reject('Error saving file. ' + e)
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
        message.error("Error deleting file. " + e)
    })
}

const makeCopy = (docId) => {
    return new Promise((resolve, reject) => {
        axios.post('/api/document/copy',
            {id: docId}).then(res => {
                resolve(res.data.id)
        }).catch(e => {
            reject(e)
        })
    })
}

export {
    saveFile,
    deleteFile,
    makeCopy
}