package com.case_study.backend.service;

import com.case_study.backend.model.Flight;
import com.case_study.backend.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    public Flight createFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public List<Flight> searchFlights(String departure, String destination, LocalDate date) {
        // Implement custom search logic here using repository
        return flightRepository.findByDepartureAndDestinationAndDate(departure, destination, date);
    }

    public Optional<Flight> getFlightById(Long id) {
        return flightRepository.findById(id);
    }

    public Flight updateFlight(Long id, Flight flightDetails) {
        return flightRepository.findById(id)
                .map(flight -> {
                    flight.setDepartureCity(flightDetails.getDepartureCity());
                    flight.setArrivalCity(flightDetails.getArrivalCity());
                    flight.setDepartureTime(flightDetails.getDepartureTime());
                    flight.setArrivalTime(flightDetails.getArrivalTime());
                    return flightRepository.save(flight);
                })
                .orElseThrow(() -> new RuntimeException("Flight not found with id " + id));
    }

    public void deleteFlight(Long id) {
        flightRepository.deleteById(id);
    }

    public Map<String, Object> checkForConflicts(Flight newFlight, Long flightId) {
        Map<String, Object> response = new HashMap<>();
        boolean hasDepartureConflict = false;
        boolean hasArrivalConflict = false;

        // Get conflicting departure flights, excluding the current flight being updated
        List<Flight> conflictingDepartureFlights = flightRepository.findConflictingDepartureFlights(
                newFlight.getDepartureCity(),
                newFlight.getDepartureTime().minusMinutes(30),
                newFlight.getDepartureTime().plusMinutes(30),
                flightId // Pass the current flight ID to exclude from conflict check
        );

        // Get conflicting arrival flights, excluding the current flight being updated
        List<Flight> conflictingArrivalFlights = flightRepository.findConflictingArrivalFlights(
                newFlight.getArrivalCity(),
                newFlight.getArrivalTime().minusMinutes(30),
                newFlight.getArrivalTime().plusMinutes(30),
                flightId // Pass the current flight ID to exclude from conflict check
        );

        // Check for departure conflicts
        if (!conflictingDepartureFlights.isEmpty()) {
            hasDepartureConflict = true;
            response.put("departureConflicts", true);
            response.put("departureMessage", "There are conflicting departure flights within 30 minutes.");
        } else {
            response.put("departureConflicts", false);
        }

        // Check for arrival conflicts
        if (!conflictingArrivalFlights.isEmpty()) {
            hasArrivalConflict = true;
            response.put("arrivalConflicts", true);
            response.put("arrivalMessage", "There are conflicting arrival flights within 30 minutes.");
        } else {
            response.put("arrivalConflicts", false);
        }

        // If there are conflicts, mark the overall response as having conflicts
        if (hasDepartureConflict || hasArrivalConflict) {
            response.put("hasConflicts", true);
        } else {
            response.put("hasConflicts", false);
        }

        return response;
    }

}
