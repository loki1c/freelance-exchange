import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AuthRequired.css";

const AuthRequired = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="display-4">Разместить задание — это бесплатно!</h1>
        <p className="lead mt-3">
          Расскажите максимально подробно о том, что хотели бы получить от
          фрилансера, укажите стоимость и сроки, чем подробнее вы опишите
          задачу, тем лучше будет результат.
        </p>
        <p className="mt-3">
          Выберите из предложений откликнувшихся фрилансеров то, которое вас
          устроит и создайте рабочую область на сайте.
        </p>
        <div className="mt-4">
          <Link to="/login" className="btn btn-success me-2">
            Войти
          </Link>
          <Link to="/registration" className="btn btn-outline-primary">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthRequired;