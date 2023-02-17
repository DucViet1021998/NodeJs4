import React from "react";

import { Button } from "antd";
import { Link } from "react-router-dom";

import classNames from 'classnames/bind';
import styles from './home.module.scss';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx("container")}>
            <div className={cx("homepage")}>
                <h1>HomePage</h1>
                <Link to={'/login'}>
                    <Button type="primary">
                        Sign In
                    </Button>
                </Link>
                <Link to={'/register'}>
                    <Button type="primary">
                        Sign Up
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default Home;