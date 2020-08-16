import {axiosInstance as axios} from "./axios";

const saveFile = (data) => {
    return new Promise((resolve, reject) => {
        axios.put('/api/document', data).then(res => {
            if (res.data.msg === 'succeed') {
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

export default saveFile