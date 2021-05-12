const SQL = require('../config/database');
const LANGUAGE = require('../config/language');
const userMessagesService = require('../services/userMessages.service');
const CONFIG = require('../config/config');
const socket = require('../socket');

const addEditUserMessages = async (req, res) => {
    try {
        let bodyData = req.body;
        let message = "";
        if (!bodyData.user_id) {
            message += LANGUAGE.user_id_required;
        }
        
        if(!bodyData.message){
            message += LANGUAGE.message_required;
        }
        bodyData.is_edited = 0;
        if (bodyData.action_type == 'edit') {
            if (!bodyData.user_message_id) {
                message += LANGUAGE.user_message_id_required;
            }
            bodyData.is_edited = 1;
        }
        if (message != "") {
            res.send({ status: false, message: message });
            // socket.getIo().emit('error',message);
        }
        else {
            let result = await userMessagesService.addEditUserMessages(bodyData);
            let userData = await userMessagesService.getUsers(bodyData.user_id);
            //result.data[0].full_name = userData.data[0].first_name;
            result.data = {
                message_type: bodyData.message_type,
                message:bodyData.message,
                full_name: userData.data[0].first_name,
                user_id: bodyData.user_id,
                is_deleted: bodyData.is_deleted
            };
            socket.getIo().emit('get_message',JSON.stringify(result));
            res.send(result);
        }
    }
    catch (e) {
        console.log("e ===>", e);
        // socket.getIo().emit('error',JSON.stringify(e));
        res.send(e);
    }
}

const getUserMessages = async (req, res) => {
    try{
        let message = "";
        let reqQuery = req.query;
        let reqParam = req.params;
        let start = typeof reqParam.start !== "undefined" ? reqParam.start : CONFIG.start;
        let limit = typeof reqParam.limit !== "undefined" ? reqParam.limit : CONFIG.limit;
        let requestData = { start, limit };
        let result = await userMessagesService.getUserMessages(requestData);
        let userMessageData = result.data;
        for(let i in userMessageData){
            let userData = await userMessagesService.getUsers(userMessageData[i].user_id);
            userMessageData[i].full_name = userData.data[0].first_name;
        }
        res.send(result);
    }
    catch(e){
        res.send(e);
    }
}

const getUsers = async (req, res) => {
    try{
        let message = "";
        let reqQuery = req.query;
        let reqParam = req.params;
        // console.log("reqparam",reqQuery);
        // let start = typeof reqParam.start !== "undefined" ? reqParam.start : CONFIG.start;
        // let limit = typeof reqParam.limit !== "undefined" ? reqParam.limit : CONFIG.limit;
        // let requestData = { start, limit };
        // console.log("ave che");
        let user_id = typeof reqQuery.user_id !== "undefined" ? reqQuery.user_id : '';
        let requestData = {user_id};
        let result = await userMessagesService.getUsers(requestData);
        res.send(result);
    }
    catch(e){
        res.send(e);
    }
}
module.exports = {
    addEditUserMessages,
    getUserMessages,
    getUsers
}

