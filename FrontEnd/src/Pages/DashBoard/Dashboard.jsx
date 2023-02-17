import React, { useContext, useEffect } from 'react';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './dashboard.css'
import { Store } from '../../store/store';
import axios from 'axios'

const { Header, Content, Sider } = Layout;
const items1 = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
    const key = String(index + 1);
    return {
        key: `sub${key}`,
        icon: React.createElement(icon),
        label: `subnav ${key}`,
        children: new Array(4).fill(null).map((_, j) => {
            const subKey = index * 4 + j + 1;
            return {
                key: subKey,
                label: `option${subKey}`,
            };
        }),
    };
});


const Dashboard = () => {
    const navigate = useNavigate()
    const store = useContext(Store)

    useEffect(() => {

        // GỌI USER LẦN ĐẦU KHI LOGIN THÀNH CÔNG
        async function getUsers() {
            const accessToken = localStorage.getItem('accessToken')
            const refreshToken = localStorage.getItem('refreshToken')
            try {
                const users = await axios.get('http://localhost:3010/', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                return users
            }


            // KHI ACCESSTOKEN HẾT HẠN THÌ CALL API REFRESH TOKEN
            catch (error) {
                if (error.response.status === 401) {

                    console.log('da het han');
                    // Refresh Token 
                    const response = await axios.post('http://localhost:3010/refresh-token',
                        {
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        })

                    localStorage.clear()
                    localStorage.setItem("accessToken", response.data.accessToken);
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                    store.login = true

                    // Return Function
                    return getUsers()
                }

            }
        }
        getUsers()

    }, []);


    const handleClickBtn = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken')
            const response = await axios.post('http://localhost:3010/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            if (response.status === 200) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                store.login = false
                navigate('/')
            }
            else {
                console.log("error1");
            }
        } catch (error) {
            console.log('error2');
        }
    }





    const {
        token: { colorBgContainer },
    } = theme.useToken();


    return (
        <Layout>
            <Header className='header'>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={items1} >
                </Menu>
            </Header>
            <Layout>
                <Sider
                    width={200}
                    style={{
                        background: colorBgContainer,
                    }}
                >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{
                            height: '100%',
                            borderRight: 0,
                        }}
                        items={items2}
                    />
                </Sider>
                <Layout
                    style={{
                        padding: '0 24px 24px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                        }}
                    >
                        <Button className='btn' onClick={handleClickBtn} type="primary">
                            Log out
                        </Button>
                    </Content>

                </Layout>
            </Layout>
        </Layout>
    );
};
export default Dashboard;