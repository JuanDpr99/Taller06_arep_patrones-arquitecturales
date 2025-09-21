/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.crud_systemmanagepropertiesv.controller;

import com.example.crud_systemmanagepropertiesv.dto.PropertyRequest;
import com.example.crud_systemmanagepropertiesv.dto.PropertyResponse;
import com.example.crud_systemmanagepropertiesv.entity.Property;
import com.example.crud_systemmanagepropertiesv.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService service;

    public PropertyController(PropertyService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PropertyResponse> create(@Valid @RequestBody PropertyRequest req) {
        Property p = service.create(req);
        return ResponseEntity.created(URI.create("/api/properties/" + p.getId()))
                .body(toResponse(p));
    }

    @GetMapping
    public List<PropertyResponse> findAll() {
        return service.findAll().stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public PropertyResponse findById(@PathVariable Long id) {
        return toResponse(service.findById(id));
    }

    @PutMapping("/{id}")
    public PropertyResponse update(@PathVariable Long id, @Valid @RequestBody PropertyRequest req) {
        return toResponse(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    private PropertyResponse toResponse(Property p) {
        return new PropertyResponse(p.getId(), p.getAddress(), p.getPrice(), p.getSize(), p.getDescription());
    }
}
