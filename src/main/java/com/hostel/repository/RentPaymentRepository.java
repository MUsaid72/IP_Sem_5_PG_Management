package com.hostel.repository;

import com.hostel.entity.RentPaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentPaymentRepository extends JpaRepository<RentPaymentEntity, Integer> {
    List<RentPaymentEntity> findByTenantId(int tenantId);
}
