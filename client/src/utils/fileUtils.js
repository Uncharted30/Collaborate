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
    return new Promise((resolve, reject) => {
        axios.delete('/api/document/' + id).then(res => {
            if (res.data.msg === 'success') {
                message.success('Success.')
                setTimeout(fetchData, 2000)
            } else {
                message.error('Error deleting file. ' + res.data.msg)
            }
        }).catch(e => {
            message.error("Error deleting file. " + e)
        })
    })
}

export {
    saveFile,
    deleteFile
}