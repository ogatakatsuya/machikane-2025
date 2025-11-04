package controller

import (
	"backend/dto"
	"backend/usecase"
	"net/http"
	"strconv"

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

func (ctrl *resultController) GetRanking(c echo.Context) error {
	// Parse query parameters with defaults
	offsetStr := c.QueryParam("offset")
	limitStr := c.QueryParam("limit")

	offset := int32(0)
	limit := int32(30)

	if offsetStr != "" {
		if parsedOffset, err := strconv.ParseInt(offsetStr, 10, 32); err == nil {
			offset = int32(parsedOffset)
		}
	}

	if limitStr != "" {
		if parsedLimit, err := strconv.ParseInt(limitStr, 10, 32); err == nil {
			limit = int32(parsedLimit)
		}
	}

	response, err := ctrl.resultUseCase.GetRanking(c.Request().Context(), offset, limit)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to get ranking: " + err.Error(),
		})
	}

	return c.JSON(http.StatusOK, response)
}
