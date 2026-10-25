package com.hostel.repository;

import com.hostel.entity.TenantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<TenantEntity, Integer> {
    Optional<TenantEntity> findByEmail(String email);
    boolean existsByEmail(String email);
}
