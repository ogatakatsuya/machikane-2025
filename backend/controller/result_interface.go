package controller

import "github.com/labstack/echo/v4"

type ResultController interface {
	CreateResult(c echo.Context) error
}