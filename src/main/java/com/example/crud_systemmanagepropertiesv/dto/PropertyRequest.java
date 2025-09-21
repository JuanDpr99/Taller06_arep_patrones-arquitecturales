package com.example.crud_systemmanagepropertiesv.dto;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class PropertyRequest {

    @NotBlank
    private String address;

    @NotNull
    @Positive
    private BigDecimal price;

    @NotNull
    @Positive
    private Double size;

    @Size(max = 1000)
    private String description;

    // getters/setters
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Double getSize() {
        return size;
    }

    public void setSize(Double size) {
        this.size = size;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
