import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client'
import aes256 from 'aes256';

const Chat = () => {

    const socket = io('http://localhost:3000');

    console.log("socket :- ", socket);

    const [leftData, setLeftData] = useState([]);
    const [rightData, setRightData] = useState([]);
    const [selectUserData, setSelectUserData] = useState({ id: 0, name: '' })
    const [writeMessageData, setWriteMessageData] = useState('');
    const [addData, setAddedData] = useState(null);


    useEffect(() => {
        socket.on('get_message', (addData) => {
            const sData = JSON.parse(addData);
            setAddedData(sData.data);
        });
    }, [])

    useEffect(() => {
        if (addData && addData != null) {
            let contactArray = rightData;
            contactArray = contactArray.concat(addData);
            console.log("contactArray :- ", contactArray);
            setRightData(contactArray);
        }
    }, [addData])

    useEffect(() => {
        console.log(localStorage.getItem('login_user'));
        LoadUser();
    }, [])

    const LoadUser = async () => {
        const result = await axios.get(`/usermessages/getUsers`);
        setLeftData(result.data.data);
        console.log("Left :- ", result.data.data);
    }

    const clickOnUser = async (id, name) => {
        setSelectUserData({ id: id, name: name })
        const result = await axios.get(`/usermessages/getUserMessages/1/500`);
        setRightData(result.data.data);
        console.log("result.data.data ;- ", result.data.data);
    }

    const writeMessage = (e) => {
        console.log(e.target.value);
        setWriteMessageData(e.target.value);
    }

    const sendMessage = async () => {
        const passData = {
            "message": aes256.encrypt('ShVmYq3t6w9y$B&E)H@McQfTjWnZr4u7', writeMessageData),
            "message_type": "text",
            "user_id": localStorage.getItem('login_user'),
            "is_deleted": "0"
        }
        await axios.post("/usermessages/addEditUserMessages", passData);
        const result = await axios.get(`/usermessages/getUserMessages/1/500`);
        setRightData(result.data.data);
        setWriteMessageData('');
    }

    return (
        <div className="chatStart">
            <div id="frame">

                <div id="sidepanel">
                    <div className="mt-2">
                    </div>
                    <div id="contacts">
                        <ul>
                            {
                                leftData.map((item, index) => (
                                    <>
                                        {
                                            item.user_id != localStorage.getItem('login_user') ?
                                                <li class='contact' onClick={() => clickOnUser(item.user_id, item.first_name + " " + item.last_name)}>
                                                    <div class="wrap">
                                                        <div class="meta">
                                                            <p class="name">{item.first_name} {item.last_name}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                : ''
                                        }
                                    </>
                                ))
                            }
                        </ul>
                    </div>
                </div>


                {
                    selectUserData && selectUserData.id && selectUserData.id != 0 ?
                        <div class="content">
                            <div class="contact-profile">
                                <p className="ml-5">{selectUserData.name}</p>
                            </div>
                            <div class="messages">
                                <ul>
                                    {
                                        rightData.length > 0 && rightData.map((item) => (
                                            <li class={`${selectUserData.id == item.user_id ? 'sent' : 'replies'}`}>
                                                <p>{item.message && item.message != null ? aes256.decrypt('ShVmYq3t6w9y$B&E)H@McQfTjWnZr4u7', item.message) : ''}</p>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <div class="message-input">
                                <div class="wrap">
                                    {console.log("writeMessageData :- ", writeMessageData)}
                                    <input type="text" value={writeMessageData} placeholder="Write your message..." onChange={(e) => writeMessage(e)} />
                                    <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
                                    <button class="submit" onClick={sendMessage}><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="py-32 text-center text-4xl font-bold">
                            Welcome
                        </div>
                }
            </div>
        </div>
    )
}

export default Chat;