import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import HomePage from "./Home";
import PageNotFound from "./404";
import BoardPage from "./BoardPage";
// import CreateUserPage from "./user/CreateUser";
// import GetUserPage from "./user/GetUser";
import "../assets/styles/main.scss";
import LoginUserPage from "./user/LoginUser";
import ProtectedRoutes from "../tools/hasAccess";
import MySocketProvider from "../context/socket";
function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path='404' element={<PageNotFound />} />
                    <Route path='login' element={<LoginUserPage />} />
                    <Route element={<MySocketProvider />}>
                        {/* <Route path='test' element={<TestPage />}></Route> */}
                        <Route element={<ProtectedRoutes />}>
                            <Route path='board' element={<BoardPage />} />
                        </Route>
                    </Route>
                    {/* <Route path="user/create" element={<CreateUserPage />} />
                        <Route path="user/get/:id" element={<GetUserPage />} /> */}
                    <Route path='*' element={<Navigate to='/404' replace />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
