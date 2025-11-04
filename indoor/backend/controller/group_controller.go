package controller

import (
	"backend/dto"
	"backend/usecase"
	"net/http"

	"github.com/labstack/echo/v4"
)

type groupController struct {
	groupUseCase usecase.GroupUseCase
}

func NewGroupController(groupUseCase usecase.GroupUseCase) GroupController {
	return &groupController{
		groupUseCase: groupUseCase,
	}
}

func (ctrl *groupController) CreateGroup(c echo.Context) error {
	var req dto.CreateGroupDto
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Failed to parse request body: " + err.Error(),
		})
	}

	if err := c.Validate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Validation failed: " + err.Error(),
		})
	}

	response, err := ctrl.groupUseCase.CreateGroup(c.Request().Context(), req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to create group: " + err.Error(),
		})
	}

	return c.JSON(http.StatusCreated, response)
}
