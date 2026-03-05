package com.example.smart_q.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    // ✅ NEW: Active status (true = active, false = blocked)
    @Column(nullable = false)
    private Boolean active = true;

    // ✅ NEW: Soft delete fields
    @Column(nullable = false)
    private Boolean deleted = false;

    @Column
    private LocalDateTime deletedAt;

    // ✅ NEW: Anonymization flag
    @Column(nullable = false)
    private Boolean anonymized = false;


}
