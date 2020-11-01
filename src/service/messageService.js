import xhr from './xhr/axios'
class MessageService {
  saveMessageInfo (body) {
    return xhr({
      method: 'post',
      url: '/message/add',
      body
    })
  }

  getAllMessage (body) {
    return xhr({
      method: 'post',
      url: '/message/getallmessgae',
      body
    })
  }

  updateMessageCheck (body) {
    return xhr({
      method: 'post',
      url: '/message/updatecheck',
      body
    })
  }

  getCheckedMessage (body) {
    return xhr({
      method: 'post',
      url: '/message/getcheckedmessage',
      body
    })
  }

  getAcceptMessgae (body) {
    return xhr({
      method: 'post',
      url: '/message/getacceptmessgae',
      body
    })
  }

  getSendMessage (body) {
    return xhr({
      method: 'post',
      url: '/message/getsendmessage',
      body
    })
  }

  getNoCheckedMessage (body) {
    return xhr({
      method: 'post',
      url: '/message/getnocheckedmessgae',
      body
    })
  }

  getMessageDetail (body) {
    return xhr({
      method: 'post',
      url: '/message/getmessagedetail',
      body
    })
  }

  updateMessagePlanCheck (body) {
    return xhr({
      method: 'post',
      url: '/message/updateplancheck',
      body
    })
  }
}
export default new MessageService()
