import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Home = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        LoadUser();
    }, [])

    const LoadUser = async () => {
        const result = await axios.get(`/usermessages/getUsers`);
        setData(result.data.data);
        console.log(result.data.data);
    }

    const history = useHistory();

    const clickOnSelectUser = (id) => {
        console.log("click on", id);
        localStorage.setItem('login_user', id);
        history.push("/chat");
    }

    return (
        <>
            <div className="text-center text-3xl p-5 font-bold">
                Select Any User
            </div>
            <div>
                {data.map((item) => (
                    <>
                        <div className="flex border-4 mx-24 p-4 rounded mt-4 cursor-pointer" onClick={() => clickOnSelectUser(item.user_id)}>
                            <div className="ml-5">
                                {item.first_name} {item.last_name}
                            </div>
                        </div>
                    </>
                ))}
            </div>
        </>
    )
}

export default Home;