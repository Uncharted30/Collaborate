const setSearchKeyWord = keyword => {
    keyword = keyword.toLowerCase()
    return {
        type: 'SET_KEYWORD',
        keyword: keyword
    }
}

const setOpenModalFunction = (openModal, fileId) => {
    return {
        type: 'SET_OPEN_MODAL',
        openModal: openModal,
        fileId: fileId
    }
}

export {setSearchKeyWord, setOpenModalFunction}