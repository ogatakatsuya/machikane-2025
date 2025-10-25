package controller

import "github.com/labstack/echo/v4"

type GroupController interface {
	CreateGroup(c echo.Context) error
}
