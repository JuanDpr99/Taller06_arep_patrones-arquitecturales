package com.example.crud_systemmanagepropertiesv.dto;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
import java.math.BigDecimal;

public class PropertyResponse {

    private Long id;
    private String address;
    private BigDecimal price;
    private Double size;
    private String description;

    public PropertyResponse(Long id, String address, BigDecimal price, Double size, String description) {
        this.id = id;
        this.address = address;
        this.price = price;
        this.size = size;
        this.description = description;
    }

    // getters
    public Long getId() {
        return id;
    }

    public String getAddress() {
        return address;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Double getSize() {
        return size;
    }

    public String getDescription() {
        return description;
    }
}
