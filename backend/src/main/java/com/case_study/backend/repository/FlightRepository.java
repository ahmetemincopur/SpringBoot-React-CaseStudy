package com.case_study.backend.repository;

import com.case_study.backend.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Long> {

        @Query("SELECT f FROM Flight f WHERE (:departure IS NULL OR f.departureCity LIKE %:departure%) " +
                        "AND (:destination IS NULL OR f.arrivalCity LIKE %:destination%) " +
                        "AND (:date IS NULL OR FUNCTION('DATE', f.departureTime) = :date)")
        List<Flight> findByDepartureAndDestinationAndDate(@Param("departure") String departure,
                        @Param("destination") String destination,
                        @Param("date") LocalDate date);

        // Query to find conflicting departure flights, excluding the current flight
        // being updated
        @Query("SELECT f FROM Flight f WHERE f.departureCity = :city " +
                        "AND (f.departureTime BETWEEN :startTime AND :endTime) " +
                        "AND f.id != :flightId")
        List<Flight> findConflictingDepartureFlights(
                        @Param("city") String city,
                        @Param("startTime") LocalDateTime startTime,
                        @Param("endTime") LocalDateTime endTime,
                        @Param("flightId") Long flightId // Pass the flight ID to exclude from conflict check
        );

        // Query to find conflicting arrival flights, excluding the current flight being
        // updated
        @Query("SELECT f FROM Flight f WHERE f.arrivalCity = :city " +
                        "AND (f.arrivalTime BETWEEN :startTime AND :endTime) " +
                        "AND f.id != :flightId")
        List<Flight> findConflictingArrivalFlights(
                        @Param("city") String city,
                        @Param("startTime") LocalDateTime startTime,
                        @Param("endTime") LocalDateTime endTime,
                        @Param("flightId") Long flightId // Pass the flight ID to exclude from conflict check
        );

}
