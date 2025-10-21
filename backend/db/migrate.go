package db

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

func Migrate(db *sql.DB) error {
	// Check if database exists by pinging
	if err := db.Ping(); err != nil {
		// If ping fails, try to create the database
		if err := createDatabaseIfNotExists(); err != nil {
			return fmt.Errorf("failed to create database: %w", err)
		}

		// Reconnect to the newly created database
		newDB, err := Connect()
		if err != nil {
			return fmt.Errorf("failed to reconnect to database: %w", err)
		}
		defer newDB.Close()
		db = newDB
	}

	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return fmt.Errorf("failed to create postgres driver: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance("file://db/migrations", "postgres", driver)
	if err != nil {
		return fmt.Errorf("failed to create migrate instance: %w", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	fmt.Println("Migrations applied successfully")
	return nil
}

func createDatabaseIfNotExists() error {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	if host == "" {
		host = "localhost"
	}
	if port == "" {
		port = "5432"
	}

	// Connect to postgres database first to create the target database
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=postgres sslmode=disable",
		host, port, user, password)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return fmt.Errorf("failed to connect to postgres database: %w", err)
	}
	defer db.Close()

	// Check if the database already exists
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = $1)", dbname).Scan(&exists)
	if err != nil {
		return fmt.Errorf("failed to check if database exists: %w", err)
	}

	if !exists {
		// Create the database
		query := fmt.Sprintf("CREATE DATABASE %s", dbname)
		_, err = db.Exec(query)
		if err != nil {
			return fmt.Errorf("failed to create database %s: %w", dbname, err)
		}
		fmt.Printf("Database %s created successfully\n", dbname)
	} else {
		fmt.Printf("Database %s already exists\n", dbname)
	}

	return nil
}
