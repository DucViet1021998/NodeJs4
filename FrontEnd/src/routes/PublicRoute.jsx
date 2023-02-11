import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './index';


function PublicRoute(props) {
    console.log(props);
    return (

        <Router>
            <div>
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<Page />}
                                setLogin={props.setLogin}
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default PublicRoute;