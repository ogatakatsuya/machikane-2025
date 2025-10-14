package controller

import (
	"backend/dto"
	"backend/usecase"
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type resultController struct {
	resultUseCase usecase.ResultUseCase
}

func NewResultController(resultUseCase usecase.ResultUseCase) ResultController {
	return &resultController{
		resultUseCase: resultUseCase,
	}
}

func (ctrl *resultController) CreateResult(c echo.Context) error {
	groupIDParam := c.Param("group_id")
	groupID, err := uuid.Parse(groupIDParam)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid group_id format: " + err.Error(),
		})
	}

	var req dto.CreateResultDto
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

	err = ctrl.resultUseCase.CreateResult(c.Request().Context(), groupID, req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to create result: " + err.Error(),
		})
	}

	return c.NoContent(http.StatusCreated)
}

func (ctrl *resultController) GetResults(c echo.Context) error {
	groupIDParam := c.Param("group_id")
	groupID, err := uuid.Parse(groupIDParam)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid group_id format: " + err.Error(),
		})
	}

	response, err := ctrl.resultUseCase.GetResults(c.Request().Context(), groupID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to get results: " + err.Error(),
		})
	}

	return c.JSON(http.StatusOK, response)
}