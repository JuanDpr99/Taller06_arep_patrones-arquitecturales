/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.crud_systemmanagepropertiesv.service;

import com.example.crud_systemmanagepropertiesv.dto.PropertyRequest;
import com.example.crud_systemmanagepropertiesv.entity.Property;
import com.example.crud_systemmanagepropertiesv.exception.NotFoundException;
import com.example.crud_systemmanagepropertiesv.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository repo;

    public PropertyService(PropertyRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public Property create(PropertyRequest req) {
        Property p = new Property();
        p.setAddress(req.getAddress());
        p.setPrice(req.getPrice());
        p.setSize(req.getSize());
        p.setDescription(req.getDescription());
        return repo.save(p);
    }

    @Transactional(readOnly = true)
    public List<Property> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Property findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Property " + id + " not found"));
    }

    @Transactional
    public Property update(Long id, PropertyRequest req) {
        Property p = findById(id);
        p.setAddress(req.getAddress());
        p.setPrice(req.getPrice());
        p.setSize(req.getSize());
        p.setDescription(req.getDescription());
        return repo.save(p);
    }

    @Transactional
    public void delete(Long id) {
        Property p = findById(id);
        repo.delete(p);
    }
}
