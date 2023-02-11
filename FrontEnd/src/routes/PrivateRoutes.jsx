import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes } from './index';


function PrivateRoues() {
    return (
        <Router>
            <div>
                <Routes>
                    {privateRoutes.map((route, index) => {
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<Page />}

                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default PrivateRoues;