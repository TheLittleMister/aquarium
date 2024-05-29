import React, { useState } from "react";

import NavBar from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import Admin from "./components/Admin/Admin";
import Teacher from "./components/Teacher/Teacher";
import Student from "./components/Student/Student";

import { Route, Routes } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import Maintenance from "./UI/Maintenance/Maintenance";

const App = () => {
  const [maintenance, setMaintenance] = useState(true);

  return (
    <>
      {maintenance ? (
        <Maintenance setMaintenance={setMaintenance} />
      ) : (
        <AuthProvider>
          <NavBar />
          <Routes>
            <Route path="/*" element={<Home />} />

            <Route
              element={
                <PrivateRoute redirectPath="login/" type="Administrador" />
              }
            >
              <Route path="admin/*" element={<Admin />} />
            </Route>

            <Route
              element={<PrivateRoute redirectPath="login/" type="Profesor" />}
            >
              <Route path="teacher/*" element={<Teacher />} />
            </Route>

            <Route
              element={<PrivateRoute redirectPath="login/" type="Estudiante" />}
            >
              <Route path="student/*" element={<Student />} />
            </Route>
          </Routes>
        </AuthProvider>
      )}
    </>
  );
};

export default App;
