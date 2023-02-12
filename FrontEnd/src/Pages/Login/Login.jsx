import React, { useContext } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { Store } from "../../store/store";


import classNames from 'classnames/bind';
import styles from './login.module.scss';


const cx = classNames.bind(styles);


const Login = () => {
    const store = useContext(Store)
    const navigate = useNavigate()

    // console.log(props);
    const onFinish = async (values) => {

        // console.log('Success:', values);
        const response = await axios.get("http://localhost:3010/login", values);
        console.log("token", response.data);

        if (response.status === 200) {
            store.login = true
            localStorage.setItem('token', response.data)
            navigate('/dashboard')
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <div className={cx('container')}>
            <div className={cx('form')}>

                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Sign in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
export default Login;