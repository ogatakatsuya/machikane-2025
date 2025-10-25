package main

import (
	"backend/cache"
	"backend/controller"
	"backend/db"
	"backend/repository"
	"backend/usecase"
	"log"
	"net/http"

	dbGenerated "backend/db/generated"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i any) error {
	return cv.validator.Struct(i)
}

func main() {
	// Try to run migrations first (will create database if needed)
	if err := db.Migrate(nil); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Database connection
	database, err := db.Connect()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()

	// Echo instance
	e := echo.New()

	// Validator
	e.Validator = &CustomValidator{validator: validator.New()}

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{
			"https://*.d3kkplual8s15w.amplifyapp.com",
			"https://*.i-maker.org",
			"http://localhost:3000",
		},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.PATCH, echo.OPTIONS},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	// Initialize Redis client
	redisClient, err := cache.NewRedisClient()
	if err != nil {
		log.Fatal("Failed to connect to Redis:", err)
	}
	defer redisClient.Close()

	// Initialize dependencies
	queries := dbGenerated.New(database)
	groupRepo := repository.NewGroupRepository(queries)
	groupUseCase := usecase.NewGroupUseCase(groupRepo)
	groupController := controller.NewGroupController(groupUseCase)
	resultRepo := repository.NewResultRepository(queries, redisClient)
	resultUseCase := usecase.NewResultUseCase(resultRepo)
	resultController := controller.NewResultController(resultUseCase)

	// Routes
	e.GET("/health", health)
	e.POST("/groups", groupController.CreateGroup)
	e.POST("/results/:group_id", resultController.CreateResult)
	e.GET("/results/:group_id", resultController.GetResults)
	e.GET("/ranking", resultController.GetRanking)

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}

func health(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}
