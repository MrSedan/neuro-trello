import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import HomePage from "./Home";
import PageNotFound from "./404";
import CreateUserPage from "./user/CreateUser";
import GetUserPage from "./user/GetUser";
import "../assets/main.css";

function App() {
    return (
        <div>
            <h1 className="title">Neuro Trello</h1>
            <BrowserRouter>
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="404" element={<PageNotFound />} />
                    <Route path="user/create" element={<CreateUserPage />} />
                    <Route path="user/get/:id" element={<GetUserPage />} />
                    <Route path="*" element={<Navigate to="/404" />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
