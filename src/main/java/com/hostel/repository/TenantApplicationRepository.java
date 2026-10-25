package com.hostel.repository;

import com.hostel.entity.TenantApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantApplicationRepository extends JpaRepository<TenantApplicationEntity, Integer> {
    List<TenantApplicationEntity> findByTenantId(int tenantId);
    List<TenantApplicationEntity> findByRoomId(int roomId);
}
