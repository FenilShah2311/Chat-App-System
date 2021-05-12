const SQL = require('../config/database');
const LANGUAGE = require('../config/language');
const CONFIG = require('../config/config');
const moment = require('moment');
const commonHelper = require('../helpers/commonHelper');

const addEditUserMessages = async (bodyData) => {
    return new Promise((resolve,reject) => {
        try{
            let currentDateTime = new Date();
            let sqlQuery = "";
            let sqlQueryValue = [];
            sqlQuery = "INSERT INTO tbl_user_messages(message,message_type,user_id,is_deleted,created_by,updated_by,created_at,updated_at) "+
                        "VALUES (?,?,?,?,?,?,?,?)";
            sqlQueryValue.push(bodyData.message,bodyData.message_type,bodyData.user_id,bodyData.is_deleted,bodyData.user_id,bodyData.user_id,currentDateTime,currentDateTime);
            SQL.query(sqlQuery,sqlQueryValue,(err, res) => {
                if(err){
                    reject({status:false,message:LANGUAGE.invalid_data});
                    console.log(err);
                }else{
                    let display_created_at =  moment(currentDateTime).format(CONFIG.TIME_FORMAT_AM);
                    resolve({status:true,message:LANGUAGE.user_message_added_successfully,display_created_at});
                }
            })
        }catch{
            reject(e);
        }
    });
}

const getUserMessages = (queryParameter) => {
    return new Promise((resolve,reject) => {
        try{
            let { start, limit } = queryParameter;
            console.log("queryparam",queryParameter);
            let sqlQuery = "";
            let whereCondition = " WHERE 1 = 1 ";
            let whereConditionValue = [];
            // if(data.user_id){
            //     whereCondition += " AND user_id = ?"
            // }
            let startLimitCondition = "";
            if (start != undefined && limit != undefined) {
                startLimitCondition += " LIMIT " + limit + " " + start;
            } else {
                startLimitCondition += "";
            }
            sqlQuery = "SELECT * FROM tbl_user_messages" + whereCondition;
            let userMessages = commonHelper.executeQuery(sqlQuery, whereConditionValue); 
            let userMessageTotalCount = commonHelper.countRecordsWithQuery(sqlQuery, whereConditionValue);
            return Promise.all([userMessageTotalCount, userMessages]).then(([count, data]) => {
                if(data.length > 0){
                    for(let i in data){
                        data[i].display_created_at =  moment(data[i].created_at).format(CONFIG.TIME_FORMAT_AM);
                    }
                    resolve({status:true,message:LANGUAGE.get_user_message_list_successfully,data:data,total_record:count});
                }else{
                    resolve({status:true,message:LANGUAGE.no_data_found,data:[],total_record:count});
                }
            });
        }
        catch(e){
            reject(e);
        } 
    });
}

const getUsers = (queryParameter) => {
    return new Promise((resolve,reject) => {
        try{
            let {userId} = queryParameter;
            let sqlQuery = "";
            let whereCondition = " WHERE 1 = 1 ";
            let whereConditionValue = [];
            if(userId != "" && userId != undefined){
                whereCondition += " AND user_id = ?";
                whereConditionValue.push(userId);
            }
            // let startLimitCondition = "";
            // if (start != undefined && limit != undefined) {
            //     startLimitCondition += " LIMIT " + limit + " " + start;
            // } else {
            //     startLimitCondition += "";
            // }
            // console.log("pahochyu");
            sqlQuery = "SELECT * FROM tbl_user" + whereCondition;
            let userMessages = commonHelper.executeQuery(sqlQuery, whereConditionValue); 
            let userMessageTotalCount = commonHelper.countRecordsWithQuery(sqlQuery, whereConditionValue);
            return Promise.all([userMessageTotalCount, userMessages]).then(([count, data]) => {
                console.log("avya data",data);
                if(data.length > 0){
                    resolve({status:true,message:LANGUAGE.get_user_list_successfully,data:data,total_record:count});
                }else{
                    resolve({status:true,message:LANGUAGE.no_data_found,data:[],total_record:count});
                }
            });
        }
        catch(e){
            reject(e);
        } 
    });
}

module.exports = {
    addEditUserMessages,
    getUserMessages,
    getUsers
}