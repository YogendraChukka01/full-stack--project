package com.surplusfood.platform.service;

import com.surplusfood.platform.model.User;
import com.surplusfood.platform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User findOrCreateByFirebaseUid(String firebaseUid, String email) {
        return userRepository.findByFirebaseUid(firebaseUid)
                .orElseGet(() -> {
                    User user = new User();
                    user.setFirebaseUid(firebaseUid);
                    user.setName("User");
                    user.setPhone("");
                    user.setEmail(email == null ? "" : email);
                    user.setRole(User.Role.DONOR);
                    user.setIsVerified(false);
                    return userRepository.save(user);
                });
    }
}
