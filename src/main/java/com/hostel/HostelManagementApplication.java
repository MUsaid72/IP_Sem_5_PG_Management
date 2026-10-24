package com.hostel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HostelManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(HostelManagementApplication.class, args);
        System.out.println("==================================================================");
        System.out.println(" Hostel & PG Management System Backend Started Successfully! ");
        System.out.println(" Web UI & Dashboard: http://localhost:8080/                      ");
        System.out.println(" REST API Base:      http://localhost:8080/api                   ");
        System.out.println("==================================================================");
    }
}
